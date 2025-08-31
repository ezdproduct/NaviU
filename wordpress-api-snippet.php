<?php

/**
 * Register custom REST API routes for user management.
 */
add_action('rest_api_init', function () {
    // Route to get current user's data
    register_rest_route('custom/v1', '/user/me', array(
        'methods' => 'GET',
        'callback' => 'naviu_get_current_user_data',
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ));

    // Route to update current user's data
    register_rest_route('custom/v1', '/user/me', array(
        'methods' => 'POST',
        'callback' => 'naviu_update_current_user_data',
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ));
});

/**
 * Callback function to get current user's data.
 *
 * @return WP_REST_Response
 */
function naviu_get_current_user_data() {
    $user = wp_get_current_user();

    if (0 === $user->ID) {
        return new WP_Error('not_logged_in', 'User is not logged in.', array('status' => 401));
    }

    $user_data = array(
        'id'          => $user->ID,
        'username'    => $user->user_login,
        'email'       => $user->user_email,
        'first_name'  => $user->first_name,
        'last_name'   => $user->last_name,
        'description' => $user->description,
    );

    return new WP_REST_Response($user_data, 200);
}

/**
 * Callback function to update current user's data.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function naviu_update_current_user_data(WP_REST_Request $request) {
    $user = wp_get_current_user();
    $params = $request->get_json_params();

    // Sanitize all incoming fields
    $new_username = isset($params['username']) ? sanitize_text_field($params['username']) : '';
    $new_email = isset($params['email']) ? sanitize_email($params['email']) : '';
    $new_password = isset($params['new_password']) ? $params['new_password'] : '';
    $current_password = isset($params['current_password']) ? $params['current_password'] : '';
    $first_name = isset($params['first_name']) ? sanitize_text_field($params['first_name']) : '';
    $last_name = isset($params['last_name']) ? sanitize_text_field($params['last_name']) : '';
    $description = isset($params['description']) ? sanitize_textarea_field($params['description']) : '';

    // --- Security Check: Verify current password if email or password is being changed ---
    $is_email_changed = strtolower($new_email) !== strtolower($user->user_email);
    $is_password_changed = !empty($new_password);

    if ($is_email_changed || $is_password_changed) {
        if (empty($current_password)) {
            return new WP_Error('missing_current_password', 'Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi.', array('status' => 400));
        }
        if (!wp_check_password($current_password, $user->user_pass, $user->ID)) {
            return new WP_Error('incorrect_current_password', 'Mật khẩu hiện tại không đúng.', array('status' => 403));
        }
    }

    // --- Prepare data for update ---
    $update_data = array('ID' => $user->ID);

    // Validate and prepare username
    if (!empty($new_username) && $new_username !== $user->user_login) {
        if (username_exists($new_username)) {
            return new WP_Error('username_exists', 'Tên đăng nhập này đã tồn tại.', array('status' => 409));
        }
        $update_data['user_login'] = $new_username;
    }

    // Validate and prepare email
    if (!empty($new_email) && $is_email_changed) {
        if (!is_email($new_email)) {
            return new WP_Error('invalid_email', 'Địa chỉ email không hợp lệ.', array('status' => 400));
        }
        if (email_exists($new_email)) {
            return new WP_Error('email_exists', 'Địa chỉ email này đã được sử dụng.', array('status' => 409));
        }
        $update_data['user_email'] = $new_email;
    }

    // Prepare other fields
    if (isset($params['first_name'])) $update_data['first_name'] = $first_name;
    if (isset($params['last_name'])) $update_data['last_name'] = $last_name;
    if (isset($params['description'])) $update_data['description'] = $description;
    if ($is_password_changed) $update_data['user_pass'] = $new_password;

    // --- Perform Update ---
    if (count($update_data) > 1) {
        $user_id = wp_update_user($update_data);

        if (is_wp_error($user_id)) {
            return new WP_Error('update_failed', $user_id->get_error_message(), array('status' => 500));
        }
    }

    // Fetch the updated user data to return to the frontend
    $updated_user = get_user_by('id', $user->ID);
    $response_data = array(
        'message'     => 'Cập nhật thông tin thành công!',
        'user'        => array(
            'id'          => $updated_user->ID,
            'username'    => $updated_user->user_login,
            'email'       => $updated_user->user_email,
            'first_name'  => $updated_user->first_name,
            'last_name'   => $updated_user->last_name,
            'description' => $updated_user->description,
        )
    );

    return new WP_REST_Response($response_data, 200);
}

?>
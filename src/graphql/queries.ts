import { gql } from '@apollo/client';

export const GET_VIEWER_PROFILE = gql`
  query GetViewerProfile {
    viewer {
      id
      username
      email
      firstName
      lastName
      # Thêm các trường khác nếu backend GraphQL của bạn hỗ trợ
      # Ví dụ:
      # description
      # avatar {
      #   url
      # }
    }
  }
`;
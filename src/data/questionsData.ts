export type Question = {
  id: string;
  text: string;
  options: string[];
};

export const questionsData: Question[] = [
  {
    id: 'q1',
    text: 'Khi đối mặt với một vấn đề phức tạp, bạn thường làm gì đầu tiên?',
    options: [
      'Phân tích vấn đề một cách logic.',
      'Tìm kiếm cảm hứng từ những ý tưởng mới.',
      'Xem xét vấn đề ảnh hưởng đến mọi người.',
      'Bắt tay vào hành động ngay lập tức.',
    ],
  },
  {
    id: 'q2',
    text: 'Khi làm việc nhóm, bạn thích vai trò nào hơn?',
    options: [
      'Người lên kế hoạch và tổ chức.',
      'Người đưa ra ý tưởng sáng tạo.',
      'Người kết nối và tạo sự hòa hợp.',
      'Người thực thi và giải quyết vấn đề.',
    ],
  },
  {
    id: 'q3',
    text: 'Điều gì mang lại cho bạn nhiều năng lượng nhất?',
    options: [
      'Hoàn thành một công việc một cách hoàn hảo.',
      'Khám phá một khả năng mới.',
      'Giúp đỡ hoặc truyền cảm hứng cho người khác.',
      'Trải nghiệm một điều gì đó mới mẻ.',
    ],
  },
  {
    id: 'q4',
    text: 'Bạn thường đưa ra quyết định dựa trên yếu tố nào?',
    options: [
      'Logic và dữ liệu.',
      'Trực giác và cảm nhận cá nhân.',
      'Giá trị và tác động đến người khác.',
      'Hiệu quả và kết quả thực tế.',
    ],
  },
  {
    id: 'q5',
    text: 'Trong một buổi tiệc, bạn thường là người như thế nào?',
    options: [
      'Quan sát và lắng nghe nhiều hơn.',
      'Tìm kiếm những cuộc trò chuyện sâu sắc.',
      'Kết nối mọi người và tạo không khí vui vẻ.',
      'Tham gia vào các hoạt động và trò chơi.',
    ],
  },
];
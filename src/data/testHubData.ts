export interface TestInfo {
  title: string;
  description: string;
  duration: string;
  tags: string[];
  icon: string; // Thay đổi IconType thành string để lưu URL hình ảnh
}

export const testHubData: { [key: string]: TestInfo[] } = {
  hieuMinh: [
    {
      title: "Trắc nghiệm ĐGTC",
      description: "Khám phá 16 nhóm tính cách để hiểu sâu hơn về bản thân và cách bạn tương tác với thế giới.",
      duration: "15 phút",
      tags: ["Tính cách", "Nội tâm"],
      icon: "https://placehold.co/48x48/E2E8F0/4A5568?text=3D", // Placeholder 3D icon
    },
    {
      title: "Bài Test Toàn Diện NaviU",
      description: "Khám phá nhóm tính cách MBTI của bạn dựa trên hệ thống NaviU.",
      duration: "10 phút",
      tags: ["Tính cách", "NaviU"],
      icon: "https://placehold.co/48x48/E2E8F0/4A5568?text=3D", // Placeholder 3D icon
    },
    {
      title: "Trắc nghiệm Holland",
      description: "Xác định 6 nhóm sở thích nghề nghiệp cốt lõi của bạn để tìm ra môi trường làm việc lý tưởng.",
      duration: "10 phút",
      tags: ["Sở thích", "Nghề nghiệp"],
      icon: "https://placehold.co/48x48/E2E8F0/4A5568?text=3D", // Placeholder 3D icon
    },
    {
      title: "Đánh giá Trí tuệ Cảm xúc (EQ)",
      description: "Đo lường khả năng nhận biết, kiểm soát và thể hiện cảm xúc của bạn và người khác.",
      duration: "20 phút",
      tags: ["Cảm xúc", "Kỹ năng mềm"],
      icon: "https://placehold.co/48x48/E2E8F0/4A5568?text=3D", // Placeholder 3D icon
    },
    {
      title: "Khám phá Giá trị Nghề nghiệp",
      description: "Xác định những giá trị quan trọng nhất mà bạn tìm kiếm trong sự nghiệp để có sự hài lòng lâu dài.",
      duration: "10 phút",
      tags: ["Giá trị", "Động lực"],
      icon: "https://placehold.co/48x48/E2E8F0/4A5568?text=3D", // Placeholder 3D icon
    },
  ],
  hieuTruong: [
    {
      title: "Môi trường học tập lý tưởng",
      description: "Bạn phù hợp với môi trường đại học năng động, nghiên cứu chuyên sâu hay sáng tạo tự do?",
      duration: "10 phút",
      tags: ["Môi trường", "Văn hóa"],
      icon: "https://placehold.co/48x48/E2E8F0/4A5568?text=3D", // Placeholder 3D icon
    },
    {
      title: "So sánh các trường Đại học",
      description: "Nhập các tiêu chí của bạn để nhận được danh sách các trường phù hợp nhất.",
      duration: "5 phút",
      tags: ["So sánh", "Chọn trường"],
      icon: "https://placehold.co/48x48/E2E8F0/4A5568?text=3D", // Placeholder 3D icon
    },
  ],
  hieuNganh: [
    {
      title: "Khám phá nhóm ngành Kỹ thuật",
      description: "Tìm hiểu về các chuyên ngành trong lĩnh vực Kỹ thuật và xem bạn phù hợp với ngành nào nhất.",
      duration: "15 phút",
      tags: ["Kỹ thuật", "Công nghệ"],
      icon: "https://placehold.co/48x48/E2E8F0/4A5568?text=3D", // Placeholder 3D icon
    },
    {
      title: "Tìm hiểu khối ngành Kinh tế",
      description: "Từ Quản trị Kinh doanh đến Marketing, khám phá thế giới đa dạng của khối ngành Kinh tế.",
      duration: "15 phút",
      tags: ["Kinh tế", "Kinh doanh"],
      icon: "https://placehold.co/48x48/E2E8F0/4A5568?text=3D", // Placeholder 3D icon
    },
    {
      title: "Bạn có phù hợp với ngành Y?",
      description: "Bài test chuyên sâu để đánh giá các tố chất cần thiết cho ngành Y Dược.",
      duration: "20 phút",
      tags: ["Y Dược", "Sức khỏe"],
      icon: "https://placehold.co/48x48/E2E8F0/4A5568?text=3D", // Placeholder 3D icon
    },
  ],
};
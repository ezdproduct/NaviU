export interface TestInfo {
  title: string;
  description: string;
  duration: string;
  tags: string[];
  headerBgClass: string; // Lớp Tailwind cho màu nền của header
  tagColorPalette: string[]; // Mảng các lớp Tailwind cho màu của tags
}

export const testHubData: { [key: string]: TestInfo[] } = {
  hieuMinh: [
    {
      title: "Trắc nghiệm ĐGTC", // Đổi tên hiển thị
      description: "Khám phá 16 nhóm tính cách để hiểu sâu hơn về bản thân và cách bạn tương tác với thế giới.",
      duration: "15 phút",
      tags: ["Tính cách", "Nội tâm"],
      headerBgClass: "bg-blue-50",
      tagColorPalette: ["bg-blue-100 text-blue-800", "bg-indigo-100 text-indigo-800"],
    },
    {
      title: "Trắc nghiệm MBTI (NaviU)", // Tên hiển thị mới cho MBTI NaviU
      description: "Khám phá nhóm tính cách MBTI của bạn dựa trên hệ thống NaviU.",
      duration: "10 phút",
      tags: ["Tính cách", "NaviU"],
      headerBgClass: "bg-green-50",
      tagColorPalette: ["bg-green-100 text-green-800", "bg-teal-100 text-teal-800"],
    },
    // Đã xóa mục "Bài Test Toàn Diện NaviU"
    {
      title: "Trắc nghiệm Holland",
      description: "Xác định 6 nhóm sở thích nghề nghiệp cốt lõi của bạn để tìm ra môi trường làm việc lý tưởng.",
      duration: "10 phút",
      tags: ["Sở thích", "Nghề nghiệp"],
      headerBgClass: "bg-orange-50",
      tagColorPalette: ["bg-orange-100 text-orange-800", "bg-yellow-100 text-yellow-800"],
    },
    {
      title: "Đánh giá Trí tuệ Cảm xúc (EQ)",
      description: "Đo lường khả năng nhận biết, kiểm soát và thể hiện cảm xúc của bạn và người khác.",
      duration: "20 phút",
      tags: ["Cảm xúc", "Kỹ năng mềm"],
      headerBgClass: "bg-purple-50",
      tagColorPalette: ["bg-purple-100 text-purple-800", "bg-pink-100 text-pink-800"],
    },
    {
      title: "Khám phá Giá trị Nghề nghiệp",
      description: "Xác định những giá trị quan trọng nhất mà bạn tìm kiếm trong sự nghiệp để có sự hài lòng lâu dài.",
      duration: "10 phút",
      tags: ["Giá trị", "Động lực"],
      headerBgClass: "bg-green-50",
      tagColorPalette: ["bg-green-100 text-green-800", "bg-teal-100 text-teal-800"],
    },
  ],
  hieuTruong: [
    {
      title: "Môi trường học tập lý tưởng",
      description: "Bạn phù hợp với môi trường đại học năng động, nghiên cứu chuyên sâu hay sáng tạo tự do?",
      duration: "10 phút",
      tags: ["Môi trường", "Văn hóa"],
      headerBgClass: "bg-indigo-50",
      tagColorPalette: ["bg-indigo-100 text-indigo-800", "bg-blue-100 text-blue-800"],
    },
    {
      title: "So sánh các trường Đại học",
      description: "Nhập các tiêu chí của bạn để nhận được danh sách các trường phù hợp nhất.",
      duration: "5 phút",
      tags: ["So sánh", "Chọn trường"],
      headerBgClass: "bg-red-50",
      tagColorPalette: ["bg-red-100 text-red-800", "bg-pink-100 text-pink-800"],
    },
  ],
  hieuNganh: [
    {
      title: "Khám phá nhóm ngành Kỹ thuật",
      description: "Tìm hiểu về các chuyên ngành trong lĩnh vực Kỹ thuật và xem bạn phù hợp với ngành nào nhất.",
      duration: "15 phút",
      tags: ["Kỹ thuật", "Công nghệ"],
      headerBgClass: "bg-teal-50",
      tagColorPalette: ["bg-teal-100 text-teal-800", "bg-green-100 text-green-800"],
    },
    {
      title: "Tìm hiểu khối ngành Kinh tế",
      description: "Từ Quản trị Kinh doanh đến Marketing, khám phá thế giới đa dạng của khối ngành Kinh tế.",
      duration: "15 phút",
      tags: ["Kinh tế", "Kinh doanh"],
      headerBgClass: "bg-amber-50",
      tagColorPalette: ["bg-amber-100 text-amber-800", "bg-orange-100 text-orange-800"],
    },
    {
      title: "Bạn có phù hợp với ngành Y?",
      description: "Bài test chuyên sâu để đánh giá các tố chất cần thiết cho ngành Y Dược.",
      duration: "20 phút",
      tags: ["Y Dược", "Sức khỏe"],
      headerBgClass: "bg-rose-50",
      tagColorPalette: ["bg-rose-100 text-rose-800", "bg-red-100 text-red-800"],
    },
  ],
};
import { IconType } from 'react-icons'; // Import IconType
import { MdPeople, MdPsychology, MdExplore, MdHandshake, MdFlag, MdSchool, MdBalance, MdBuild, MdWork, MdMedicalServices } from 'react-icons/md'; // Import Material Design icons

export interface TestInfo {
  title: string;
  description: string;
  duration: string;
  tags: string[];
  icon: IconType; // Thay đổi LucideIcon thành IconType
  iconBgColor: string; // Tailwind color class for icon background
  iconColor: string; // Tailwind color class for icon color
}

export const testHubData: { [key: string]: TestInfo[] } = {
  hieuMinh: [
    {
      title: "Trắc nghiệm ĐGTC",
      description: "Khám phá 16 nhóm tính cách để hiểu sâu hơn về bản thân và cách bạn tương tác với thế giới.",
      duration: "15 phút",
      tags: ["Tính cách", "Nội tâm"],
      icon: MdPeople, // Sử dụng MdPeople
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Bài Test Toàn Diện NaviU",
      description: "Khám phá nhóm tính cách MBTI của bạn dựa trên hệ thống NaviU.",
      duration: "10 phút",
      tags: ["Tính cách", "NaviU"],
      icon: MdPsychology, // Sử dụng MdPsychology
      iconBgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Trắc nghiệm Holland",
      description: "Xác định 6 nhóm sở thích nghề nghiệp cốt lõi của bạn để tìm ra môi trường làm việc lý tưởng.",
      duration: "10 phút",
      tags: ["Sở thích", "Nghề nghiệp"],
      icon: MdExplore, // Sử dụng MdExplore
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Đánh giá Trí tuệ Cảm xúc (EQ)",
      description: "Đo lường khả năng nhận biết, kiểm soát và thể hiện cảm xúc của bạn và người khác.",
      duration: "20 phút",
      tags: ["Cảm xúc", "Kỹ năng mềm"],
      icon: MdHandshake, // Sử dụng MdHandshake
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Khám phá Giá trị Nghề nghiệp",
      description: "Xác định những giá trị quan trọng nhất mà bạn tìm kiếm trong sự nghiệp để có sự hài lòng lâu dài.",
      duration: "10 phút",
      tags: ["Giá trị", "Động lực"],
      icon: MdFlag, // Sử dụng MdFlag
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
  ],
  hieuTruong: [
    {
      title: "Môi trường học tập lý tưởng",
      description: "Bạn phù hợp với môi trường đại học năng động, nghiên cứu chuyên sâu hay sáng tạo tự do?",
      duration: "10 phút",
      tags: ["Môi trường", "Văn hóa"],
      icon: MdSchool, // Sử dụng MdSchool
      iconBgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "So sánh các trường Đại học",
      description: "Nhập các tiêu chí của bạn để nhận được danh sách các trường phù hợp nhất.",
      duration: "5 phút",
      tags: ["So sánh", "Chọn trường"],
      icon: MdBalance, // Sử dụng MdBalance
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ],
  hieuNganh: [
    {
      title: "Khám phá nhóm ngành Kỹ thuật",
      description: "Tìm hiểu về các chuyên ngành trong lĩnh vực Kỹ thuật và xem bạn phù hợp với ngành nào nhất.",
      duration: "15 phút",
      tags: ["Kỹ thuật", "Công nghệ"],
      icon: MdBuild, // Sử dụng MdBuild
      iconBgColor: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      title: "Tìm hiểu khối ngành Kinh tế",
      description: "Từ Quản trị Kinh doanh đến Marketing, khám phá thế giới đa dạng của khối ngành Kinh tế.",
      duration: "15 phút",
      tags: ["Kinh tế", "Kinh doanh"],
      icon: MdWork, // Sử dụng MdWork
      iconBgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Bạn có phù hợp với ngành Y?",
      description: "Bài test chuyên sâu để đánh giá các tố chất cần thiết cho ngành Y Dược.",
      duration: "20 phút",
      tags: ["Y Dược", "Sức khỏe"],
      icon: MdMedicalServices, // Sử dụng MdMedicalServices
      iconBgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ],
};
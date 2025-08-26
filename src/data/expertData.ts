export interface Expert {
  id: number;
  name: string;
  title: string;
  avatar: string;
  specialties: string[];
  bio: string;
  experience: string;
  rating: number;
}

export const expertData: Expert[] = [
  {
    id: 1,
    name: "Trần Minh Anh",
    title: "Chuyên gia Hướng nghiệp & MBTI",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&fit=crop&crop=faces",
    specialties: ["MBTI", "Holland Code", "Tư vấn du học"],
    bio: "Với hơn 10 năm kinh nghiệm, tôi chuyên giúp các bạn trẻ khám phá tiềm năng bản thân thông qua các công cụ trắc nghiệm tính cách và sở thích, từ đó xây dựng lộ trình sự nghiệp vững chắc.",
    experience: "10+ năm kinh nghiệm",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Lê Thị Bích Hằng",
    title: "Chuyên gia Tâm lý học đường",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&h=150&fit=crop&crop=faces",
    specialties: ["Tâm lý vị thành niên", "Quản lý stress", "EQ"],
    bio: "Tôi tập trung vào việc hỗ trợ sức khỏe tinh thần cho học sinh, sinh viên, giúp các em vượt qua áp lực học tập và các khó khăn trong cuộc sống để phát triển một cách toàn diện.",
    experience: "8 năm kinh nghiệm",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Phạm Gia Huy",
    title: "Cố vấn Khởi nghiệp & Công nghệ",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=150&h=150&fit=crop&crop=faces",
    specialties: ["Startup", "Công nghệ", "Định hướng ngành IT"],
    bio: "Là một người có kinh nghiệm thực chiến trong lĩnh vực công nghệ và khởi nghiệp, tôi mong muốn chia sẻ kiến thức và giúp các bạn trẻ định hướng đúng đắn trong ngành IT đầy biến động.",
    experience: "12 năm kinh nghiệm",
    rating: 5.0,
  },
];
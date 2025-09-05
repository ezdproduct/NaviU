import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/HeroSection';
import FeatureSection from '@/components/landing/FeatureSection';
import TestimonialSection from '@/components/landing/TestimonialSection'; // Import the new TestimonialSection
// Removed Footer import
// Removed LandingPageHeader import
import CareerPreviewSection from '@/components/landing/CareerPreviewSection'; // Import the new CareerPreviewSection
import {
  Brain,
  Compass,
  Users,
  FileText,
  Award,
  Lightbulb,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Search, // New icon
  ClipboardList, // New icon
  Target, // New icon
  MessageCircle, // New icon
} from 'lucide-react'; // Import icons from lucide-react

const Index = () => {
  return (
    <> {/* Removed the div wrapper as LandingLayout provides it */}
      {/* Removed LandingPageHeader */}
      <HeroSection />

      <main className="flex-1">
        {/* Feature Section 1: Thấu Hiểu Bản Thân */}
        <FeatureSection
          title="Thấu Hiểu Bản Thân Sâu Sắc"
          description="Với các bài trắc nghiệm khoa học như MBTI, Holland, EQ và Giá trị nghề nghiệp, NaviU giúp bạn khám phá tính cách, sở thích, năng lực và động lực cốt lõi."
          features={[
            { icon: Brain, name: "Tính cách (MBTI)", description: "Khám phá 16 nhóm tính cách để hiểu rõ bản thân." },
            { icon: Compass, name: "Sở thích (Holland)", description: "Xác định môi trường làm việc lý tưởng của bạn." },
            { icon: Award, name: "Trí tuệ Cảm xúc (EQ)", description: "Đo lường khả năng quản lý cảm xúc." },
            { icon: Lightbulb, name: "Giá trị Nghề nghiệp", description: "Tìm kiếm điều bạn thực sự coi trọng trong sự nghiệp." },
          ]}
          ctaText="Làm bài test ngay"
          ctaLink="/profile?initialView=do-test"
        />

        {/* Feature Section 2: Định Hướng Sự Nghiệp */}
        <FeatureSection
          title="Định Hướng Sự Nghiệp Phù Hợp"
          description="Dựa trên hồ sơ cá nhân, NaviU gợi ý các ngành nghề, trường học và lộ trình phát triển phù hợp nhất với bạn, mở ra cánh cửa tương lai."
          features={[
            { icon: Briefcase, name: "Gợi ý Ngành nghề", description: "Khám phá các ngành nghề phù hợp với năng lực và sở thích." },
            { icon: GraduationCap, name: "Phân tích Trường học", description: "Tìm kiếm trường đại học lý tưởng cho bạn." },
            { icon: FileText, name: "Báo cáo Chi tiết", description: "Nhận báo cáo cá nhân hóa về con đường sự nghiệp." },
          ]}
          ctaText="Xem báo cáo chi tiết"
          ctaLink="/profile?initialView=report"
          reverse
        />

        {/* New Feature Section: Hành Trình Của Bạn Cùng NaviU */}
        <FeatureSection
          title="Hành Trình Của Bạn Cùng NaviU"
          description="NaviU đồng hành cùng bạn qua từng bước, từ khám phá bản thân đến chinh phục sự nghiệp mơ ước."
          features={[
            { icon: Search, name: "Khám phá bản thân", description: "Làm các bài test khoa học để hiểu rõ tính cách, sở thích và năng lực." },
            { icon: ClipboardList, name: "Nhận báo cáo cá nhân", description: "Xem phân tích chi tiết và các gợi ý định hướng phù hợp với bạn." },
            { icon: Target, name: "Định hướng lộ trình", description: "Lựa chọn ngành, trường, nghề phù hợp với mục tiêu và tiềm năng." },
            { icon: MessageCircle, name: "Kết nối chuyên gia", description: "Nhận tư vấn 1-1 để đưa ra những quyết định sáng suốt." },
          ]}
          ctaText="Bắt đầu ngay"
          ctaLink="/register"
        />

        {/* Feature Section 3: Kết Nối Chuyên Gia */}
        <FeatureSection
          title="Kết Nối Với Chuyên Gia Hàng Đầu"
          description="Nhận tư vấn 1-1 từ các chuyên gia hướng nghiệp, tâm lý và cố vấn ngành để có những quyết định sáng suốt và tự tin hơn."
          features={[
            { icon: Users, name: "Tư vấn Cá nhân", description: "Hỗ trợ trực tiếp từ các chuyên gia giàu kinh nghiệm." },
            { icon: MessageSquare, name: "Hỗ trợ Tâm lý", description: "Vượt qua áp lực và phát triển tinh thần vững vàng." },
            { icon: Briefcase, name: "Cố vấn Ngành", description: "Hiểu rõ hơn về các lĩnh vực nghề nghiệp bạn quan tâm." },
          ]}
          ctaText="Tìm chuyên gia của bạn"
          ctaLink="/profile?initialView=connect"
          reverse
        />

        {/* New Career Preview Section */}
        <CareerPreviewSection />

        {/* Final Call to Action */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Sẵn sàng kiến tạo tương lai của bạn?
            </h2>
            <p className="text-lg md:text-xl mb-10 opacity-90">
              Tham gia NaviU ngay hôm nay để bắt đầu hành trình khám phá bản thân và định hình sự nghiệp mơ ước.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Đăng ký miễn phí ngay
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <TestimonialSection /> {/* Render the new TestimonialSection here */}
      {/* Removed Footer */}
    </>
  );
};

export default Index;
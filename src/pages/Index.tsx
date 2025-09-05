import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/HeroSection';
import FeatureSection from '@/components/landing/FeatureSection';
import TestimonialSection from '@/components/landing/TestimonialSection';
import CareerPreviewSection from '@/components/landing/CareerPreviewSection';
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
  Search,
  ClipboardList,
  Target,
  MessageCircle,
  XCircle,
  CheckCircle2,
  FileCheck2, // Import FileCheck2 icon
  Map, // Import Map icon
} from 'lucide-react';

const Index = () => {
  return (
    <>
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

        {/* Problem Statement Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center"> {/* Adjusted gap for responsiveness */}
                    <div className="lg:col-span-2">
                        <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
                             alt="Nhóm học sinh đang bối rối trước nhiều lựa chọn" 
                             className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-[4/3]"
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 text-center lg:text-left">Bạn Có Đang Mắc Kẹt Giữa Vô Vàn Lựa Chọn?</h2> {/* Added text-center lg:text-left */}
                        <p className="text-gray-600 mb-8 text-center lg:text-left">Giữa hàng ngàn lựa chọn ngành học và áp lực từ nhiều phía, không ít học sinh cảm thấy hoang mang, dẫn đến những quyết định sai lầm đáng tiếc cho tương lai.</p> {/* Added text-center lg:text-left */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            {/* Stat Card 1 */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:scale-105 transition-transform duration-300"> {/* Added text-center and hover effect */}
                                <p className="text-4xl font-extrabold text-blue-600 mb-2">90%</p>
                                <h3 className="text-lg font-semibold mb-2">Học sinh bối rối</h3>
                                <p className="text-gray-600 text-sm">Cảm thấy không chắc chắn và thiếu thông tin khi đứng trước ngưỡng cửa chọn ngành.</p>
                            </div>
                            {/* Stat Card 2 */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:scale-105 transition-transform duration-300"> {/* Added text-center and hover effect */}
                                <p className="text-4xl font-extrabold text-blue-600 mb-2">62.6%</p>
                                <h3 className="text-lg font-semibold mb-2">Sinh viên chọn sai ngành</h3>
                                <p className="text-gray-600 text-sm">Nhận ra lựa chọn của mình không phù hợp sau năm đầu tiên.</p>
                            </div>
                            {/* Stat Card 3 */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:scale-105 transition-transform duration-300"> {/* Added text-center and hover effect */}
                                <p className="text-4xl font-extrabold text-blue-600 mb-2">Lãng Phí</p>
                                <h3 className="text-lg font-semibold mb-2">Thời gian & Chi phí</h3>
                                <p className="text-gray-600 text-sm">Gây lãng phí 4-5 năm đại học, chi phí và cơ hội phát triển.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Journey Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                 <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"> {/* Adjusted gap for responsiveness */}
                    <div>
                        <div className="text-center lg:text-left mb-12"> {/* Adjusted text alignment for responsiveness */}
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hành Trình Của Bạn Cùng NaviU</h2>
                            <p className="text-gray-600">Chúng tôi đồng hành cùng bạn qua từng bước, từ khám phá bản thân đến xây dựng lộ trình sự nghiệp vững chắc.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Step Card */}
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"> {/* Added hover effect */}
                                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                                    <Search className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">1. Khám phá bản thân</h3>
                                <p className="text-gray-600">Thực hiện các bài trắc nghiệm khoa học.</p>
                            </div>
                            {/* Step Card */}
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"> {/* Added hover effect */}
                                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                                     <FileCheck2 className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">2. Nhận báo cáo</h3>
                                <p className="text-gray-600">Hệ thống phân tích và trả kết quả chi tiết.</p>
                            </div>
                            {/* Step Card */}
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"> {/* Added hover effect */}
                                 <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                                    <Map className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">3. Định hướng lộ trình</h3>
                                <p className="text-gray-600">Xây dựng kế hoạch học tập và phát triển sự nghiệp.</p>
                            </div>
                            {/* Step Card */}
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"> {/* Added hover effect */}
                                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                                    <MessageCircle className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">4. Kết nối chuyên gia</h3>
                                <p className="text-gray-600">Trò chuyện 1-1 với các cố vấn hàng đầu.</p>
                            </div>
                        </div>
                         <div className="text-center lg:text-left mt-12"> {/* Adjusted text alignment for responsiveness */}
                            <Button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                Bắt đầu ngay
                            </Button>
                        </div>
                    </div>
                     <div className="hidden lg:block">
                        <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80" 
                             alt="Chuyên gia đang tư vấn cho học sinh" 
                             className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-[4/5]"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Roadmap & Savings Section */}
        <section className="py-16 md:py-24 bg-blue-50/50">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"> {/* Adjusted gap for responsiveness */}
                    <div className="order-2 lg:order-1">
                        <div className="text-center lg:text-left mb-8"> {/* Adjusted text alignment for responsiveness */}
                            <span className="text-blue-600 font-semibold tracking-wider">LỘ TRÌNH VỮNG CHẮC</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-2">Đầu Tư Thông Minh Cho Tương Lai</h2>
                            <p className="text-gray-600">Việc chọn đúng ngành ngay từ đầu không chỉ là một quyết định sự nghiệp, mà còn là một khoản đầu tư tài chính khôn ngoan. NaviU giúp bạn tiết kiệm chi phí và thời gian khổng lồ.</p>
                        </div>
                        <div className="space-y-6">
                            {/* Without NaviU Card */}
                            <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]"> {/* Added hover effect */}
                                <div className="flex items-start space-x-4">
                                     <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
                                        <XCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Khi không có định hướng</h4>
                                        <p className="text-gray-600 mt-1">Rủi ro chọn sai ngành, lãng phí <strong className="text-red-600">~4 năm học</strong> và chi phí lên tới <strong className="text-red-600">hàng trăm triệu đồng</strong>. Áp lực, hoang mang và phải bắt đầu lại từ đầu.</p>
                                    </div>
                                </div>
                            </div>
                            {/* With NaviU Card */}
                             <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]"> {/* Added hover effect */}
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Với lộ trình từ NaviU</h4>
                                        <p className="text-gray-600 mt-1">Một khoản đầu tư nhỏ cho sự <strong className="text-blue-600">tự tin, chắc chắn</strong>. Tiết kiệm thời gian, tiền bạc và đi đúng con đường sự nghiệp mơ ước ngay từ bước đầu tiên.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <img src="https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                             alt="Biểu đồ tài chính và tiết kiệm" 
                             className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-[4/3]"
                        />
                    </div>
                </div>
            </div>
        </section>

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

      <TestimonialSection />
    </>
  );
};

export default Index;
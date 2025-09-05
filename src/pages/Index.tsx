import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/HeroSection';
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
  ScanLine, // New icon
  BrainCircuit, // New icon
  BarChart3, // New icon
  Star, // New icon
} from 'lucide-react';

const Index = () => {
  return (
    <>
      <HeroSection />

      <main className="flex-1">
        {/* Problem Statement Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-5 gap-16 items-center">
                    <div className="lg:col-span-2">
                        <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
                             alt="Nhóm học sinh đang bối rối trước nhiều lựa chọn" 
                             className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-[4/3]"
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 text-center lg:text-left">Bạn Có Đang Mắc Kẹt Giữa Vô Vàn Lựa Chọn?</h2>
                        <p className="text-gray-600 mb-8 text-center lg:text-left">Giữa hàng ngàn lựa chọn ngành học và áp lực từ nhiều phía, không ít học sinh cảm thấy hoang mang, dẫn đến những quyết định sai lầm đáng tiếc cho tương lai.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            {/* Stat Card 1 */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <p className="text-4xl font-extrabold text-blue-600 mb-2">90%</p>
                                <h3 className="text-xl font-semibold mb-2">Học sinh bối rối</h3>
                                <p className="text-gray-600 text-sm">Cảm thấy không chắc chắn và thiếu thông tin khi đứng trước ngưỡng cửa chọn ngành.</p>
                            </div>
                            {/* Stat Card 2 */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <p className="text-4xl font-extrabold text-blue-600 mb-2">62.6%</p>
                                <h3 className="text-xl font-semibold mb-2">Sinh viên chọn sai ngành</h3>
                                <p className="text-gray-600 text-sm">Nhận ra lựa chọn của mình không phù hợp sau năm đầu tiên.</p>
                            </div>
                            {/* Stat Card 3 */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <p className="text-4xl font-extrabold text-blue-600 mb-2">Lãng Phí</p>
                                <h3 className="text-xl font-semibold mb-2">Thời gian & Chi phí</h3>
                                <p className="text-gray-600 text-sm">Gây lãng phí 4-5 năm đại học, chi phí và cơ hội phát triển.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section 1: Thấu Hiểu Bản Thân */}
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Thấu Hiểu Bản Thân Sâu Sắc</h2>
                    <p className="text-gray-600">Với các bài trắc nghiệm khoa học như Holland, MBTI, DISC và MI, hệ thống giúp bạn khám phá tính cách, sở thích, năng lực và giá trị cốt lõi của mình.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature Card */}
                    <div className="feature-card bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <ScanLine className="w-10 h-10 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Trắc nghiệm Holland</h3>
                        <p className="text-gray-600 text-sm">Khám phá nhóm ngành nghề phù hợp với sở thích và năng lực của bạn.</p>
                    </div>
                    {/* Feature Card */}
                    <div className="feature-card bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <BrainCircuit className="w-10 h-10 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Trí thông minh (MRTI)</h3>
                        <p className="text-gray-600 text-sm">Hiểu rõ 8 loại hình trí tuệ để phát huy tối đa tiềm năng.</p>
                    </div>
                    {/* Feature Card */}
                    <div className="feature-card bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <Compass className="w-10 h-10 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">La bàn (Holland)</h3>
                        <p className="text-gray-600 text-sm">Xác định các giá trị quan trọng, định hướng cuộc sống và sự nghiệp.</p>
                    </div>
                    {/* Feature Card */}
                    <div className="feature-card bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <Briefcase className="w-10 h-10 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Gợi ý ngành nghề</h3>
                        <p className="text-gray-600 text-sm">Khám phá các ngành nghề phù hợp với đặc điểm và năng lực cá nhân.</p>
                    </div>
                     {/* Feature Card */}
                    <div className="feature-card bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <BarChart3 className="w-10 h-10 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Phân tích thị trường</h3>
                        <p className="text-gray-600 text-sm">Tìm hiểu xu hướng thị trường lao động để có lựa chọn tối ưu.</p>
                    </div>
                    {/* Feature Card */}
                    <div className="feature-card bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <FileText className="w-10 h-10 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Báo cáo chi tiết</h3>
                        <p className="text-gray-600 text-sm">Nhận báo cáo phân tích toàn diện về bản thân và định hướng.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Journey Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                 <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="text-center lg:text-left mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hành Trình Của Bạn Cùng NaviU</h2>
                            <p className="text-gray-600">Chúng tôi đồng hành cùng bạn qua từng bước, từ khám phá bản thân đến xây dựng lộ trình sự nghiệp vững chắc.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Step Card */}
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                                    <Search className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">1. Khám phá bản thân</h3>
                                <p className="text-gray-600 text-sm">Thực hiện các bài trắc nghiệm khoa học.</p>
                            </div>
                            {/* Step Card */}
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                                     <FileCheck2 className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">2. Nhận báo cáo</h3>
                                <p className="text-gray-600 text-sm">Hệ thống phân tích và trả kết quả chi tiết.</p>
                            </div>
                            {/* Step Card */}
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                 <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                                    <Map className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">3. Định hướng lộ trình</h3>
                                <p className="text-gray-600 text-sm">Xây dựng kế hoạch học tập và phát triển sự nghiệp.</p>
                            </div>
                            {/* Step Card */}
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                                    <MessageCircle className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">4. Kết nối chuyên gia</h3>
                                <p className="text-gray-600 text-sm">Trò chuyện 1-1 với các cố vấn hàng đầu.</p>
                            </div>
                        </div>
                         <div className="text-center lg:text-left mt-12">
                            <Button asChild className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105">
                                <Link to="/register">Bắt đầu ngay</Link>
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
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="text-center lg:text-left mb-8">
                            <span className="text-blue-600 font-semibold tracking-wider">LỘ TRÌNH VỮNG CHẮC</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-2">Đầu Tư Thông Minh Cho Tương Lai</h2>
                            <p className="text-gray-600">Việc chọn đúng ngành ngay từ đầu không chỉ là một quyết định sự nghiệp, mà còn là một khoản đầu tư tài chính khôn ngoan. NaviU giúp bạn tiết kiệm chi phí và thời gian khổng lồ.</p>
                        </div>
                        <div className="space-y-6">
                            {/* Without NaviU Card */}
                            <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                                <div className="flex items-start space-x-4">
                                     <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
                                        <XCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Khi không có định hướng</h4>
                                        <p className="text-gray-600 mt-1 text-sm">Rủi ro chọn sai ngành, lãng phí <strong className="text-red-600">~4 năm học</strong> và chi phí lên tới <strong className="text-red-600">hàng trăm triệu đồng</strong>. Áp lực, hoang mang và phải bắt đầu lại từ đầu.</p>
                                    </div>
                                </div>
                            </div>
                            {/* With NaviU Card */}
                             <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Với lộ trình từ NaviU</h4>
                                        <p className="text-gray-600 mt-1 text-sm">Một khoản đầu tư nhỏ cho sự <strong className="text-blue-600">tự tin, chắc chắn</strong>. Tiết kiệm thời gian, tiền bạc và đi đúng con đường sự nghiệp mơ ước ngay từ bước đầu tiên.</p>
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

        {/* Career Compass Section */}
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">La Bàn Sự Nghiệp Của Bạn</h2>
                    <p className="text-gray-600">Khám phá những ngành nghề phù hợp nhất với kết quả phân tích tính cách, sở thích và năng lực.</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-600">#</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">TÊN NGÀNH/NGHỀ</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">CHUYÊN VIÊN TƯ VẤN TỪ</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">MỨC ĐỘ PHÙ HỢP</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">NHU CẦU THỊ TRƯỜNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="p-4 text-gray-500">1</td>
                                    <td className="p-4 font-medium">Chuyên viên tư vấn tâm lý</td>
                                    <td className="p-4 text-gray-600">MindCare Clinic</td>
                                    <td className="p-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Cao</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="p-4 text-gray-500">2</td>
                                    <td className="p-4 font-medium">Nhà thiết kế UI/UX</td>
                                    <td className="p-4 text-gray-600">Creative Hub</td>
                                    <td className="p-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                         <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Cao</span>
                                    </td>
                                </tr>
                                 <tr className="border-b border-gray-200">
                                    <td className="p-4 text-gray-500">3</td>
                                    <td className="p-4 font-medium">Giáo viên</td>
                                    <td className="p-4 text-gray-600">EduNext Academy</td>
                                    <td className="p-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                         <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Trung bình</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-gray-500">4</td>
                                    <td className="p-4 font-medium">Nhà biên tập nội dung</td>
                                    <td className="p-4 text-gray-600">Content Creators</td>
                                    <td className="p-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                         <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Trung bình</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center mt-10">
                    <Link to="/profile?initialView=report" className="text-blue-600 font-semibold hover:underline">Xem bản cáo đầy đủ &rarr;</Link>
                </div>
            </div>
        </section>


        {/* CTA Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6 text-center">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng kiến tạo tương lai của bạn?</h2>
                 <p className="text-gray-600 max-w-2xl mx-auto mb-8">Tham gia NaviU ngay hôm nay để bắt đầu hành trình khám phá bản thân và định hướng sự nghiệp.</p>
                 <Button asChild className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105">
                    <Link to="/register">Định hướng sự nghiệp ngay</Link>
                </Button>
            </div>
        </section>


        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Những gì người dùng nói về NaviU</h2>
                    <p className="text-gray-600">Chúng tôi luôn mong muốn lắng nghe chia sẻ của người dùng để không ngừng cải tiến và mang lại giá trị tốt nhất.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Testimonial Card */}
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <img src="https://placehold.co/48x48/E2E8F0/4A5568?text=EJ" alt="Emily Johnson" className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <h4 className="font-semibold">Emily Johnson</h4>
                                <div className="flex text-amber-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">"NaviU đã giúp tôi thấu hiểu bản thân và định hướng được con đường sự nghiệp rõ ràng hơn. Giao diện thân thiện và dễ sử dụng."</p>
                    </div>
                    {/* Testimonial Card */}
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <img src="https://placehold.co/48x48/E2E8F0/4A5568?text=EM" alt="Ethan Miller" className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <h4 className="font-semibold">Ethan Miller</h4>
                                <div className="flex text-amber-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">"Tôi đã sử dụng NaviU để được tư vấn 1-1 với chuyên gia. Các buổi tư vấn rất hữu ích và mang lại nhiều giá trị thực tiễn."</p>
                    </div>
                    {/* Testimonial Card */}
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <img src="https://placehold.co/48x48/E2E8F0/4A5568?text=OC" alt="Olivia Carter" className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <h4 className="font-semibold">Olivia Carter</h4>
                                <div className="flex text-amber-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">"Nhờ NaviU, tôi đã tự tin hơn với lựa chọn ngành học của mình. Báo cáo phân tích rất chi tiết và dễ hiểu."</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    {/* Footer */}
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <img src="/naviU.png" alt="NaviU Logo" className="h-8 mx-auto mb-4" />
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} NaviU. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Kiến tạo tương lai, bắt đầu từ thấu hiểu bản thân.
        </p>
      </div>
    </footer>
    </>
  );
};

export default Index;
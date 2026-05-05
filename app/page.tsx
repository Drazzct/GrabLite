"use client";

import Link from "next/link";
import { Zap, Shield, Coins } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="bg-linear-to-r from-green-600 to-green-700 text-white py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Chuyến đi của bạn, theo cách của bạn
          </h1>
          <p className="text-xl sm:text-2xl text-green-100 max-w-2xl mx-auto">
            Dịch vụ chia sẻ xe nhanh chóng, an toàn và đáng tin cậy ngay trong
            tầm tay bạn
          </p>
          {!isSignedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/auth/signin"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Đặt chuyến xe
              </Link>
              <Link
                href="/auth/signup"
                className="bg-green-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-900 transition border-2 border-white"
              >
                Trở thành tài xế
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Tại sao chọn Gra<span className="text-green-600">bK</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition text-center flex flex-col items-center">
              <Zap className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nhanh chóng & đáng tin cậy
              </h3>
              <p className="text-gray-600">
                Được đón nhanh chóng với mạng lưới tài xế chuyên nghiệp hoạt
                động 24/7
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition text-center flex flex-col items-center">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                An toàn & bảo mật
              </h3>
              <p className="text-gray-600">
                Theo dõi thời gian thực, xác minh tài xế và hỗ trợ khẩn cấp giúp
                bạn yên tâm
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition text-center flex flex-col items-center">
              <Coins className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Giá cả phải chăng
              </h3>
              <p className="text-gray-600">
                Giá minh bạch, không phí ẩn – biết trước chi phí trước khi đi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Passengers */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Cách hoạt động cho hành khách
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                num: "1",
                title: "Yêu cầu",
                desc: "Mở ứng dụng và nhập điểm đến",
              },
              {
                num: "2",
                title: "Ghép chuyến",
                desc: "Ghép ngay với tài xế gần bạn",
              },
              {
                num: "3",
                title: "Di chuyển",
                desc: "Tận hưởng chuyến đi thoải mái",
              },
              {
                num: "4",
                title: "Đánh giá",
                desc: "Để lại đánh giá giúp cải thiện",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Drivers */}
      <section className="py-20 px-4 sm:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Cách hoạt động cho tài xế
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Đăng ký", desc: "Tạo tài khoản và xác minh" },
              {
                num: "2",
                title: "Đăng ký xe",
                desc: "Thêm thông tin và giấy tờ xe",
              },
              { num: "3", title: "Bật hoạt động", desc: "Bắt đầu nhận chuyến" },
              {
                num: "4",
                title: "Kiếm tiền",
                desc: "Làm việc với lịch linh hoạt",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-8 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">X+</div>
            <p className="text-green-100">Tài xế đang hoạt động</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">Y+</div>
            <p className="text-green-100">Hành khách hài lòng</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">Z+</div>
            <p className="text-green-100">Chuyến đi hoàn thành</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">T/5</div>
            <p className="text-green-100">Đánh giá trung bình</p>
          </div>
        </div>
      </section>

      {!isSignedIn && (
        <section className="py-20 px-4 sm:px-8 bg-gray-900 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu chưa?</h2>
          <p className="text-gray-300 mb-6">
            Tham gia cùng hàng ngàn người dùng
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/signin"
              className="bg-green-600 px-6 py-3 rounded-lg"
            >
              Đặt xe
            </Link>
            <Link
              href="/auth/signup"
              className="bg-green-600 px-6 py-3 rounded-lg"
            >
              Đăng ký tài xế
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">GrabK</h3>
              <p className="text-sm">
                Đối tác chia sẻ chuyến đi đáng tin cậy của bạn
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3">Dành cho hành khách</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/passengers" className="hover:text-white">
                    Đặt chuyến xe
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Khuyến mãi
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3">Dành cho tài xế</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/drivers" className="hover:text-white">
                    Trở thành tài xế
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Hỗ trợ tài xế
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3">Pháp lý</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Điều khoản dịch vụ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2026 GrabK. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

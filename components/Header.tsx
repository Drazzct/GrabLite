"use client";

import { Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isSignedIn, signOut } = useAuth();
  const pathname = usePathname();

  const userType = user?.userType || "passenger";

  const navClass = (href: string) =>
    `py-2 md:py-1 font-medium transition ${
      pathname === href
        ? "text-green-600 border-b-2 border-green-600"
        : "text-gray-700 hover:text-green-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img src="/logo.svg" alt="GrabLite Logo" className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-gray-900">GrabLite</span>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-600 hover:text-green-600 transition"
        >
          <Menu className="w-6 h-6" />
        </button>

        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex absolute md:relative top-16 md:top-0 left-0 md:left-0 right-0 md:right-auto bg-white md:bg-transparent md:space-x-8 flex-col md:flex-row p-4 md:p-0 w-full md:w-auto space-x-6`}
        >
          {isSignedIn ? (
            <>
              <Link
                href={userType === "Driver" ? "/drivers" : "/passengers"}
                className={navClass(
                  userType === "Driver" ? "/drivers" : "/passengers",
                )}
              >
                Trang chủ
              </Link>

              {userType === "Driver" && (
                <>
                  <Link
                    href="/drivers/vehicles"
                    className={navClass("/drivers/vehicles")}
                  >
                    Quản lý xe
                  </Link>
                  <Link
                    href="/drivers/trips"
                    className={navClass("/drivers/trips")}
                  >
                    Chuyến đi
                  </Link>
                </>
              )}

              {userType === "Passenger" && (
                <>
                  <Link
                    href="/passengers/trips"
                    className={navClass("/passengers/trips")}
                  >
                    Chuyến đi của tôi
                  </Link>
                  <Link
                    href="/passengers/book"
                    className={navClass("/passengers/book")}
                  >
                    Đặt xe
                  </Link>
                </>
              )}

              <div className="border-t md:border-t-0 md:border-l border-gray-500 md:pl-8 pt-4 md:pt-0">
                {user?.name && (
                  <p className="text-sm text-gray-600 mb-2 md:mb-0 md:hidden">
                    {user.name}
                  </p>
                )}
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 py-2 md:py-1 font-medium transition"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/" className={navClass("/")}>
                Trang chủ
              </Link>
              <Link href="/auth/signin" className={navClass("/auth/signin")}>
                Đăng nhập
              </Link>
              <Link
                href="/auth/signup"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition md:py-1 font-medium"
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

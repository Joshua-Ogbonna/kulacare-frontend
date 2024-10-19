"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const phoneNumber = localStorage.getItem("phoneNumber");
    setIsLoggedIn(!!phoneNumber);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("phoneNumber");
    setIsLoggedIn(false);
    router.push("/signin");
    // Force a reload of the page
    window.location.reload();
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push("/chat");
    } else {
      router.push("/signin");
    }
  };

  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        <div className="flex items-center">
          <svg
            className="w-8 h-8 text-teal-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-2 text-xl font-semibold text-teal-600">
            Kulacare
          </span>
        </div>
        <div className="hidden md:flex space-x-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>

          <Link href="/" className="text-gray-600 hover:text-gray-900">
            How It Works
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            About Us
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/chat" className="text-gray-600 hover:text-gray-900">
                Chat
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-gray-900"
              >
                Profile
              </Link>
            </>
          )}
        </div>
        {isLoggedIn ? (
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        )}
      </nav>
    </header>
  );
};

export default Header;

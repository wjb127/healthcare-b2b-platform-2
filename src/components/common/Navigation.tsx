"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, FileText, TrendingUp, Users, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "홈", icon: Home, implemented: true },
    { href: "/bidding", label: "응찰", icon: FileText, implemented: true },
    { href: "/market", label: "시장분석", icon: TrendingUp, implemented: false },
    { href: "/partners", label: "파트너", icon: Users, implemented: false },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HB</span>
            </div>
            <span className="font-semibold text-slate-900 text-lg">
              Healthcare B2B
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              item.implemented ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <div
                  key={item.href}
                  className="flex items-center gap-2 text-slate-400 cursor-not-allowed relative group"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    준비 중
                  </span>
                </div>
              )
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-slate-300 text-slate-400 hover:bg-slate-50 cursor-not-allowed"
              disabled
              title="준비 중"
            >
              로그인
            </Button>
            <Button 
              className="bg-slate-400 hover:bg-slate-400 text-white cursor-not-allowed"
              disabled
              title="준비 중"
            >
              회원가입
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-slate-200"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  item.implemented ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <div
                      key={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-lg cursor-not-allowed"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs ml-auto bg-slate-200 px-2 py-1 rounded">준비 중</span>
                    </div>
                  )
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-200">
                  <Button 
                    variant="outline" 
                    className="w-full border-slate-300 text-slate-400 hover:bg-slate-50 cursor-not-allowed"
                    disabled
                  >
                    로그인 (준비 중)
                  </Button>
                  <Button 
                    className="w-full bg-slate-400 hover:bg-slate-400 text-white cursor-not-allowed"
                    disabled
                  >
                    회원가입 (준비 중)
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import RoleSwitcher from "./RoleSwitcher";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50/30">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,transparent_70%,black)]" />
      
      <div className="container relative z-10 mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-8 flex justify-center">
            <RoleSwitcher />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
            헬스케어 B2B
            <span className="block text-teal-600 mt-2">거래 플랫폼</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto">
            의료기기, 의약품, 헬스케어 서비스를 위한
            <br />
            신뢰할 수 있는 B2B 거래 플랫폼
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg"
            >
              무료로 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg"
              onClick={() => window.location.href = '/bidding'}
            >
              응찰 시스템 체험
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">안전한 거래</h3>
              <p className="text-sm text-slate-600">검증된 파트너와 안전한 거래</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">실시간 시세</h3>
              <p className="text-sm text-slate-600">최신 시장 가격 정보 제공</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">네트워크</h3>
              <p className="text-sm text-slate-600">10,000+ 헬스케어 기업 참여</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
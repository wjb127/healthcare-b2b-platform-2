"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  Zap,
  LineChart,
  Package,
  FileSearch,
  HeartHandshake,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "인증된 거래처",
    description: "모든 거래처는 사업자 등록 및 의료기기 판매업 허가를 검증합니다.",
  },
  {
    icon: Zap,
    title: "빠른 견적 시스템",
    description: "실시간 견적 요청과 응답으로 빠른 거래 성사를 지원합니다.",
  },
  {
    icon: LineChart,
    title: "가격 동향 분석",
    description: "AI 기반 시장 가격 분석으로 합리적인 거래를 도와드립니다.",
  },
  {
    icon: Package,
    title: "재고 관리",
    description: "실시간 재고 현황 공유로 효율적인 공급망 관리가 가능합니다.",
  },
  {
    icon: FileSearch,
    title: "스마트 매칭",
    description: "AI가 최적의 거래처를 자동으로 추천해 드립니다.",
  },
  {
    icon: HeartHandshake,
    title: "안전한 에스크로",
    description: "대금 보호 시스템으로 안심하고 거래할 수 있습니다.",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            플랫폼 핵심 기능
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            헬스케어 B2B 거래를 위한 맞춤형 기능들을 제공합니다
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300 border-slate-200">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
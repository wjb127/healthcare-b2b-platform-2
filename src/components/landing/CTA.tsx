"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";

export default function CTA() {
  const [requirements, setRequirements] = useState([""]);

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-teal-50 to-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              헬스케어 B2B 거래의 새로운 기준을 경험해보세요.
              <br />
              무료로 가입하고 바로 거래를 시작할 수 있습니다.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full" />
                <span className="text-slate-700">무료 가입, 신용카드 불필요</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full" />
                <span className="text-slate-700">24시간 이내 담당자 연락</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full" />
                <span className="text-slate-700">전문 컨설턴트 1:1 온보딩 지원</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 shadow-xl border-0 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                빠른 가입 신청
              </h3>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="company" className="text-slate-700">
                    회사명
                  </Label>
                  <Input
                    id="company"
                    placeholder="(주)헬스케어"
                    className="mt-1 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-slate-700">
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    className="mt-1 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-slate-700">
                    연락처
                  </Label>
                  <Input
                    id="phone"
                    placeholder="02-1234-5678"
                    className="mt-1 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <Label className="text-slate-700 mb-2 block">
                    거래 품목
                  </Label>
                  {requirements.map((req, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        placeholder="예: 의료기기, 진단시약"
                        className="bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                      />
                      {requirements.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          삭제
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRequirement}
                    className="mt-2 bg-teal-300/30 border-teal-300 text-teal-700 hover:bg-teal-300/50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    항목 추가
                  </Button>
                </div>

                <div>
                  <Label htmlFor="message" className="text-slate-700">
                    문의사항 (선택)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="추가로 문의하실 내용을 입력해주세요"
                    className="mt-1 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg"
                >
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  DollarSign,
  Clock,
  Shield,
  Package,
  Star,
  TrendingUp,
} from "lucide-react";

interface ScoringWeight {
  id: string;
  name: string;
  description: string;
  weight: number;
  icon: React.ElementType;
  color: string;
}

interface WeightedScoringProps {
  onScoreChange?: (score: number, weights: Record<string, number>) => void;
  bidData?: {
    price: number;
    deliveryDays: number;
    qualityCertificates: number;
    previousOrders: number;
  };
}

export default function WeightedScoring({ onScoreChange, bidData }: WeightedScoringProps) {
  const [weights, setWeights] = useState<ScoringWeight[]>([
    {
      id: "price",
      name: "가격 경쟁력",
      description: "제안 가격의 경쟁력",
      weight: 40,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      id: "delivery",
      name: "납기 일정",
      description: "납품 소요 기간",
      weight: 20,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      id: "quality",
      name: "품질 인증",
      description: "품질 관련 인증서 보유",
      weight: 25,
      icon: Shield,
      color: "text-purple-600",
    },
    {
      id: "experience",
      name: "거래 실적",
      description: "이전 거래 성공률",
      weight: 15,
      icon: Package,
      color: "text-orange-600",
    },
  ]);

  const [totalScore, setTotalScore] = useState(0);
  const [scoreAnimation, setScoreAnimation] = useState(false);

  // Calculate total score based on weights and bid data
  useEffect(() => {
    const calculateScore = () => {
      if (!bidData) return 0;

      // Simple scoring logic (in real app, this would be more complex)
      const scores = {
        price: Math.max(0, 100 - (bidData.price / 10000000) * 10), // Lower price = higher score
        delivery: Math.max(0, 100 - bidData.deliveryDays * 2), // Faster delivery = higher score
        quality: Math.min(100, bidData.qualityCertificates * 20), // More certificates = higher score
        experience: Math.min(100, bidData.previousOrders * 5), // More orders = higher score
      };

      let weightedScore = 0;
      weights.forEach((weight) => {
        const score = scores[weight.id as keyof typeof scores] || 0;
        weightedScore += (score * weight.weight) / 100;
      });

      return Math.round(weightedScore);
    };

    const newScore = calculateScore();
    if (newScore !== totalScore) {
      setScoreAnimation(true);
      setTotalScore(newScore);
      
      const weightsObject = weights.reduce((acc, w) => ({
        ...acc,
        [w.id]: w.weight,
      }), {});
      
      onScoreChange?.(newScore, weightsObject);

      setTimeout(() => setScoreAnimation(false), 500);
    }
  }, [weights, bidData, totalScore, onScoreChange]);

  const handleWeightChange = (id: string, value: number[]) => {
    const newValue = value[0];
    const oldWeight = weights.find(w => w.id === id)?.weight || 0;
    const difference = newValue - oldWeight;

    // Redistribute the difference among other weights proportionally
    const totalOtherWeights = weights
      .filter(w => w.id !== id)
      .reduce((sum, w) => sum + w.weight, 0);

    const updatedWeights = weights.map(weight => {
      if (weight.id === id) {
        return { ...weight, weight: newValue };
      } else if (totalOtherWeights > 0) {
        const proportion = weight.weight / totalOtherWeights;
        const adjustment = difference * proportion;
        const newWeight = Math.max(0, Math.min(100, weight.weight - adjustment));
        return { ...weight, weight: Math.round(newWeight) };
      }
      return weight;
    });

    // Normalize to ensure total is 100
    const total = updatedWeights.reduce((sum, w) => sum + w.weight, 0);
    if (total !== 100 && total > 0) {
      const factor = 100 / total;
      updatedWeights.forEach(w => {
        w.weight = Math.round(w.weight * factor);
      });
    }

    setWeights(updatedWeights);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "우수";
    if (score >= 60) return "양호";
    if (score >= 40) return "보통";
    return "미흡";
  };

  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-slate-900">
              가중치 평가 시스템
            </h3>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={totalScore}
              initial={{ opacity: 0.8, scale: 0.95 }}
              animate={{ 
                opacity: scoreAnimation ? [0.8, 1, 0.8, 1] : 1,
                scale: scoreAnimation ? [0.95, 1.05, 0.95, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="text-right">
                <p className="text-sm text-slate-600">종합 점수</p>
                <p className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                  {totalScore}
                </p>
              </div>
              <Badge 
                className={`
                  ${totalScore >= 80 ? "bg-green-100 text-green-700 border-green-300" : ""}
                  ${totalScore >= 60 && totalScore < 80 ? "bg-blue-100 text-blue-700 border-blue-300" : ""}
                  ${totalScore >= 40 && totalScore < 60 ? "bg-yellow-100 text-yellow-700 border-yellow-300" : ""}
                  ${totalScore < 40 ? "bg-red-100 text-red-700 border-red-300" : ""}
                `}
              >
                <Star className="h-3 w-3 mr-1" />
                {getScoreLabel(totalScore)}
              </Badge>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          {weights.map((weight) => {
            const Icon = weight.icon;
            return (
              <motion.div
                key={weight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${weight.color}`} />
                    <Label className="text-slate-700">{weight.name}</Label>
                    <span className="text-xs text-slate-500">
                      {weight.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.span
                      key={weight.weight}
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium text-slate-700 min-w-[3rem] text-right"
                    >
                      {weight.weight}%
                    </motion.span>
                  </div>
                </div>
                
                <div className="relative">
                  <Slider
                    value={[weight.weight]}
                    onValueChange={(value) => handleWeightChange(weight.id, value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <style jsx global>{`
                    [data-radix-ui-slider-track] {
                      background-color: #e2e8f0;
                    }
                    [data-radix-ui-slider-range] {
                      background-color: #0ea5a4;
                    }
                    [data-radix-ui-slider-thumb] {
                      border: 2px solid #0ea5a4;
                      background-color: white;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    [data-radix-ui-slider-thumb]:focus {
                      outline: none;
                      box-shadow: 0 0 0 3px rgba(14, 165, 164, 0.2);
                    }
                  `}</style>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">가중치 합계</span>
            <span className={`font-medium ${
              weights.reduce((sum, w) => sum + w.weight, 0) === 100
                ? "text-green-600"
                : "text-red-600"
            }`}>
              {weights.reduce((sum, w) => sum + w.weight, 0)}%
            </span>
          </div>
        </div>

        {bidData && (
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-2">현재 입찰 데이터</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">제안가격:</span>
                <span className="font-medium">{bidData.price.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">납기일:</span>
                <span className="font-medium">{bidData.deliveryDays}일</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">품질인증:</span>
                <span className="font-medium">{bidData.qualityCertificates}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">거래실적:</span>
                <span className="font-medium">{bidData.previousOrders}건</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg">
          <TrendingUp className="h-4 w-4 text-teal-600" />
          <p className="text-sm text-teal-700">
            가중치를 조정하여 평가 기준을 맞춤 설정할 수 있습니다
          </p>
        </div>
      </div>
    </Card>
  );
}
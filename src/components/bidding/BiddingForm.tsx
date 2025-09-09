"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Send, FileText, Calendar, Package, Clock, Award, Calculator } from "lucide-react";
import FilterPanel, { FilterOptions } from "./FilterPanel";
import FileUploadArea from "./FileUploadArea";
import WeightedScoring from "./WeightedScoring";

type BidStatus = "submitted" | "accepted" | "rejected" | "pending" | "open" | "closed" | "awarded";

interface Bid {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  submittedDate: string;
  status: BidStatus;
  companyName: string;
  deadline?: string;
  score?: number;
}

export default function BiddingForm() {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    unitPrice: "",
    deliveryDate: "",
    paymentTerms: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [scoringWeights, setScoringWeights] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
    priceMin: "",
    priceMax: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  // Sample bid history data with deadline
  const [bidHistory, setBidHistory] = useState<Bid[]>([
    {
      id: "BID-001",
      productName: "MRI 스캐너",
      quantity: 2,
      unitPrice: 500000000,
      totalPrice: 1000000000,
      submittedDate: "2024-01-15",
      status: "awarded",
      companyName: "(주)메디칼솔루션",
      deadline: "2024-01-20",
      score: 92,
    },
    {
      id: "BID-002",
      productName: "초음파 진단기",
      quantity: 5,
      unitPrice: 80000000,
      totalPrice: 400000000,
      submittedDate: "2024-01-14",
      status: "open",
      companyName: "(주)헬스케어테크",
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
      score: 78,
    },
    {
      id: "BID-003",
      productName: "혈액분석기",
      quantity: 10,
      unitPrice: 15000000,
      totalPrice: 150000000,
      submittedDate: "2024-01-12",
      status: "closed",
      companyName: "(주)바이오메드",
      deadline: "2024-01-18",
      score: 65,
    },
    {
      id: "BID-004",
      productName: "환자 모니터링 시스템",
      quantity: 20,
      unitPrice: 5000000,
      totalPrice: 100000000,
      submittedDate: "2024-01-10",
      status: "open",
      companyName: "(주)스마트메디",
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
      score: 85,
    },
    {
      id: "BID-005",
      productName: "디지털 X-ray 시스템",
      quantity: 1,
      unitPrice: 300000000,
      totalPrice: 300000000,
      submittedDate: "2024-01-08",
      status: "closed",
      companyName: "(주)메디텍",
      deadline: "2024-01-15",
      score: 71,
    },
  ]);

  // Filter and sort bid history
  const filteredBids = useMemo(() => {
    let filtered = [...bidHistory];

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (bid) =>
          bid.productName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          bid.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          bid.companyName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((bid) => bid.status === filters.status);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((bid) => bid.submittedDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((bid) => bid.submittedDate <= filters.dateTo);
    }

    // Price range filter
    if (filters.priceMin) {
      filtered = filtered.filter((bid) => bid.totalPrice >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter((bid) => bid.totalPrice <= parseInt(filters.priceMax));
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case "date":
          comparison = a.submittedDate.localeCompare(b.submittedDate);
          break;
        case "price":
          comparison = a.totalPrice - b.totalPrice;
          break;
        case "quantity":
          comparison = a.quantity - b.quantity;
          break;
        default:
          comparison = 0;
      }
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [bidHistory, filters]);

  const isFormValid = 
    formData.productName && 
    formData.quantity && 
    formData.unitPrice && 
    formData.deliveryDate && 
    formData.paymentTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      productName: "",
      quantity: "",
      unitPrice: "",
      deliveryDate: "",
      paymentTerms: "",
      notes: "",
    });
  };

  const getStatusBadge = (status: BidStatus) => {
    const statusConfig = {
      submitted: {
        label: "제출됨",
        className: "bg-teal-300/30 text-teal-700 border-teal-300/50",
      },
      accepted: {
        label: "수락됨",
        className: "bg-blue-500/20 text-blue-700 border-blue-500/50",
      },
      rejected: {
        label: "거절됨",
        className: "bg-gray-200 text-gray-600 border-gray-300",
      },
      pending: {
        label: "검토중",
        className: "bg-yellow-100 text-yellow-700 border-yellow-300",
      },
      open: {
        label: "진행중",
        className: "bg-teal-300/30 text-teal-700 border-teal-300/50",
        icon: Clock,
      },
      closed: {
        label: "마감",
        className: "bg-gray-200 text-gray-600 border-gray-300",
      },
      awarded: {
        label: "낙찰",
        className: "bg-blue-500/20 text-blue-700 border-blue-500/50",
        icon: Award,
      },
    };

    const config = statusConfig[status];
    if (!config) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
          {status}
        </Badge>
      );
    }
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={config.className}>
        {Icon && <Icon className="h-3 w-3 mr-1" />}
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleExport = (format: "csv" | "xlsx") => {
    // Export logic here
    console.log(`Exporting as ${format}...`);
    // In a real app, you would generate the file and download it
    const data = filteredBids.map(bid => ({
      "응찰번호": bid.id,
      "제품명": bid.productName,
      "회사명": bid.companyName,
      "수량": bid.quantity,
      "단가": bid.unitPrice,
      "총액": bid.totalPrice,
      "제출일": bid.submittedDate,
      "마감일": bid.deadline || "-",
      "상태": bid.status,
    }));
    
    if (format === "csv") {
      // CSV export logic
      alert("CSV 파일로 내보내기가 완료되었습니다.");
    } else {
      // XLSX export logic
      alert("XLSX 파일로 내보내기가 완료되었습니다.");
    }
  };

  // Auto-close bids after deadline
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      setBidHistory(prevBids => 
        prevBids.map(bid => {
          if (bid.deadline && bid.status === "open" && bid.deadline < today) {
            return { ...bid, status: "closed" };
          }
          return bid;
        })
      );
    };

    // Check immediately on mount
    checkDeadlines();

    // Check every minute
    const interval = setInterval(checkDeadlines, 60000);

    return () => clearInterval(interval);
  }, []);

  const getRemainingTime = (deadline?: string) => {
    if (!deadline) return null;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "마감";
    if (diffDays === 0) return "오늘 마감";
    if (diffDays === 1) return "1일 남음";
    return `${diffDays}일 남음`;
  };

  const handleScoreChange = (score: number, weights: Record<string, number>) => {
    setCurrentScore(score);
    setScoringWeights(weights);
  };

  // Sample bid data for scoring demonstration
  const sampleBidData = {
    price: parseInt(formData.unitPrice) || 50000000,
    deliveryDays: formData.deliveryDate 
      ? Math.ceil((new Date(formData.deliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 30,
    qualityCertificates: 3,
    previousOrders: 12,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-8">응찰 관리</h1>

        {/* Filter Panel */}
        <FilterPanel 
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Bidding Form - Takes 2 columns on XL screens */}
          <div className="xl:col-span-2">
            <Card className="p-8 shadow-lg border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                새 응찰 등록
              </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="productName" className="text-slate-700">
                  제품명 *
                </Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="예: MRI 스캐너"
                  className="mt-1 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <Label htmlFor="quantity" className="text-slate-700">
                  수량 *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  min="1"
                  className="mt-1 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <Label htmlFor="unitPrice" className="text-slate-700">
                  단가 (원) *
                </Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="mt-1 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <Label htmlFor="deliveryDate" className="text-slate-700">
                  납품 예정일 *
                </Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="mt-1 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <Label htmlFor="paymentTerms" className="text-slate-700">
                  결제 조건 *
                </Label>
                <Select
                  value={formData.paymentTerms}
                  onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                  required
                >
                  <SelectTrigger className="bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600">
                    <SelectValue placeholder="결제 조건 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">즉시 결제</SelectItem>
                    <SelectItem value="net30">30일 이내</SelectItem>
                    <SelectItem value="net60">60일 이내</SelectItem>
                    <SelectItem value="net90">90일 이내</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-slate-700">
                추가 요청사항
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="특별 요청사항이나 참고사항을 입력해주세요"
                className="mt-1 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-8 py-3 text-lg font-medium transition-colors ${
                  isFormValid && !isSubmitting
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>처리중...</>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    응찰 제출
                  </>
                )}
              </Button>
            </div>

            <div>
              <Label className="text-slate-700 mb-2 block">
                첨부 파일
              </Label>
              <FileUploadArea 
                maxFiles={5}
                acceptedFormats={[".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".png"]}
                onFilesChange={(files) => console.log("Files changed:", files)}
              />
            </div>
          </form>
            </Card>
          </div>

          {/* Weighted Scoring Panel - Takes 1 column on XL screens */}
          <div className="xl:col-span-1">
            <WeightedScoring 
              onScoreChange={handleScoreChange}
              bidData={sampleBidData}
            />
          </div>
        </div>

        {/* Bid History Table */}
        <Card className="p-8 shadow-lg border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              응찰 내역
            </h2>
            <div className="text-sm text-slate-600">
              총 {filteredBids.length}개의 응찰
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      응찰 번호
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      제품명
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-600 font-medium">회사명</TableHead>
                  <TableHead className="text-slate-600 font-medium text-right">수량</TableHead>
                  <TableHead className="text-slate-600 font-medium text-right">단가</TableHead>
                  <TableHead className="text-slate-600 font-medium text-right">총액</TableHead>
                  <TableHead className="text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      제출일
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      마감일
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-600 font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Calculator className="h-4 w-4" />
                      점수
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-600 font-medium">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBids.map((bid) => (
                  <TableRow key={bid.id} className="border-slate-200 hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-900">
                      {bid.id}
                    </TableCell>
                    <TableCell className="text-slate-700">{bid.productName}</TableCell>
                    <TableCell className="text-slate-700">{bid.companyName}</TableCell>
                    <TableCell className="text-right text-slate-700">
                      {bid.quantity}
                    </TableCell>
                    <TableCell className="text-right text-slate-700">
                      {formatCurrency(bid.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">
                      {formatCurrency(bid.totalPrice)}
                    </TableCell>
                    <TableCell className="text-slate-700">{bid.submittedDate}</TableCell>
                    <TableCell className="text-slate-700">
                      <div className="flex flex-col gap-1">
                        <span>{bid.deadline || "-"}</span>
                        {bid.status === "open" && bid.deadline && (
                          <span className="text-xs text-teal-600 font-medium">
                            {getRemainingTime(bid.deadline)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {bid.score && (
                        <motion.div
                          key={bid.score}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: [0.8, 1, 0.8, 1] }}
                          transition={{ duration: 0.5 }}
                          className={`font-semibold text-lg ${
                            bid.score >= 80 ? "text-green-600" :
                            bid.score >= 60 ? "text-blue-600" :
                            bid.score >= 40 ? "text-yellow-600" :
                            "text-red-600"
                          }`}
                        >
                          {bid.score}
                        </motion.div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(bid.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
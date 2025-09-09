"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  Search,
  Filter,
  Calendar,
  Download,
} from "lucide-react";

interface FilterPanelProps {
  onFilterChange?: (filters: FilterOptions) => void;
  onExport?: (format: "csv" | "xlsx") => void;
}

export interface FilterOptions {
  searchTerm: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  priceMin: string;
  priceMax: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export default function FilterPanel({ onFilterChange, onExport }: FilterPanelProps) {
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

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      searchTerm: "",
      status: "all",
      dateFrom: "",
      dateTo: "",
      priceMin: "",
      priceMax: "",
      sortBy: "date",
      sortOrder: "desc",
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const handleExportCSV = () => {
    onExport?.("csv");
  };

  const handleExportXLSX = () => {
    onExport?.("xlsx");
  };

  return (
    <Card className="p-6 mb-6 bg-white border-slate-200">
      <div className="space-y-4">
        {/* Header Row with Search and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="제품명 또는 응찰 번호로 검색..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                className="pl-10 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isExpanded ? "필터 숨기기" : "상세 필터"}
            </Button>

            <Button
              onClick={handleExportCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>

            <Button
              onClick={handleExportXLSX}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              XLSX
            </Button>
          </div>
        </div>

        {/* Expandable Filter Section */}
        {isExpanded && (
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <Label htmlFor="status" className="text-slate-700 mb-2 block">
                  상태
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="submitted">제출됨</SelectItem>
                    <SelectItem value="accepted">수락됨</SelectItem>
                    <SelectItem value="rejected">거절됨</SelectItem>
                    <SelectItem value="pending">검토중</SelectItem>
                    <SelectItem value="open">진행중</SelectItem>
                    <SelectItem value="closed">마감</SelectItem>
                    <SelectItem value="awarded">낙찰</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div>
                <Label htmlFor="dateFrom" className="text-slate-700 mb-2 block">
                  시작일
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                    className="pl-10 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateTo" className="text-slate-700 mb-2 block">
                  종료일
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                    className="pl-10 bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <Label htmlFor="sortBy" className="text-slate-700 mb-2 block">
                  <span className="flex items-center gap-2">
                    정렬
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </span>
                </Label>
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split("-");
                    handleFilterChange("sortBy", sortBy);
                    handleFilterChange("sortOrder", sortOrder as "asc" | "desc");
                  }}
                >
                  <SelectTrigger className="bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">최신순</SelectItem>
                    <SelectItem value="date-asc">오래된순</SelectItem>
                    <SelectItem value="price-desc">가격 높은순</SelectItem>
                    <SelectItem value="price-asc">가격 낮은순</SelectItem>
                    <SelectItem value="quantity-desc">수량 많은순</SelectItem>
                    <SelectItem value="quantity-asc">수량 적은순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="priceMin" className="text-slate-700 mb-2 block">
                  최소 금액
                </Label>
                <Input
                  id="priceMin"
                  type="number"
                  placeholder="0"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                  className="bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                />
              </div>

              <div>
                <Label htmlFor="priceMax" className="text-slate-700 mb-2 block">
                  최대 금액
                </Label>
                <Input
                  id="priceMax"
                  type="number"
                  placeholder="999,999,999"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                  className="bg-white border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                />
              </div>

              <div className="lg:col-span-2 flex items-end">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  필터 초기화
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
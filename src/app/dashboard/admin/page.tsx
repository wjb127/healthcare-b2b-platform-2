'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import CountUp from 'react-countup'
import {
  TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Activity,
  FileText, Award, AlertCircle, CheckCircle, Clock, Zap, Target,
  ArrowUpRight, ArrowDownRight, RefreshCw, Eye, Download, Filter,
  Calendar, MapPin, Briefcase, Package, CreditCard, BarChart3
} from 'lucide-react'

// 실시간 데이터 시뮬레이션
const generateRealtimeData = () => ({
  activeUsers: Math.floor(Math.random() * 50) + 100,
  ongoingBids: Math.floor(Math.random() * 20) + 30,
  todayRevenue: Math.floor(Math.random() * 50000000) + 100000000,
  conversionRate: (Math.random() * 10 + 85).toFixed(1),
})

export default function AdminDashboard() {
  const [realtimeData, setRealtimeData] = useState(generateRealtimeData())
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 실시간 데이터 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(generateRealtimeData())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // 매출 추이 데이터
  const revenueData = [
    { month: '1월', revenue: 4500000000, projects: 45, bids: 134 },
    { month: '2월', revenue: 5200000000, projects: 52, bids: 156 },
    { month: '3월', revenue: 6100000000, projects: 61, bids: 189 },
    { month: '4월', revenue: 5800000000, projects: 58, bids: 172 },
    { month: '5월', revenue: 7200000000, projects: 72, bids: 213 },
    { month: '6월', revenue: 8500000000, projects: 85, bids: 251 },
  ]

  // 카테고리별 프로젝트 분포
  const categoryData = [
    { name: '의료기기', value: 35, color: '#0EA5E9' },
    { name: 'IT/SW', value: 28, color: '#8B5CF6' },
    { name: '시설/장비', value: 20, color: '#10B981' },
    { name: '의료소모품', value: 12, color: '#F59E0B' },
    { name: '기타', value: 5, color: '#6B7280' },
  ]

  // 입찰 경쟁률 데이터
  const competitionData = [
    { category: '의료기기', 경쟁률: 8.5, 평균가격: 85 },
    { category: 'IT/SW', 경쟁률: 6.3, 평균가격: 72 },
    { category: '시설/장비', 경쟁률: 5.8, 평균가격: 68 },
    { category: '의료소모품', 경쟁률: 9.2, 평균가격: 90 },
    { category: '기타', 경쟁률: 4.5, 평균가격: 55 },
  ]

  // 사용자 성장 데이터
  const userGrowthData = [
    { week: 'W1', buyers: 120, suppliers: 180 },
    { week: 'W2', buyers: 135, suppliers: 210 },
    { week: 'W3', buyers: 148, suppliers: 245 },
    { week: 'W4', buyers: 162, suppliers: 280 },
  ]

  // 지역별 활동 데이터
  const regionData = [
    { region: '서울', projects: 145, value: 85000000000 },
    { region: '경기', projects: 98, value: 62000000000 },
    { region: '부산', projects: 56, value: 38000000000 },
    { region: '대구', projects: 42, value: 28000000000 },
    { region: '인천', projects: 38, value: 25000000000 },
  ]

  // KPI 카드 데이터
  const kpiCards = [
    {
      title: '총 거래액',
      value: 8500000000,
      change: 12.5,
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      isCurrency: true,
    },
    {
      title: '활성 프로젝트',
      value: 156,
      change: 8.3,
      trend: 'up',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '등록 사용자',
      value: 1842,
      change: 15.2,
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: '평균 낙찰률',
      value: 87.3,
      change: -2.1,
      trend: 'down',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      suffix: '%',
    },
  ]

  // 실시간 활동 피드
  const activityFeed = [
    { id: 1, type: 'project', message: '서울대병원이 새 프로젝트를 등록했습니다', time: '방금 전', icon: FileText },
    { id: 2, type: 'bid', message: '메디칼솔루션이 입찰을 제출했습니다', time: '2분 전', icon: ShoppingCart },
    { id: 3, type: 'award', message: 'MRI 장비 구매 건이 낙찰되었습니다', time: '5분 전', icon: Award },
    { id: 4, type: 'user', message: '새로운 공급업체가 가입했습니다', time: '8분 전', icon: Users },
    { id: 5, type: 'alert', message: '프로젝트 마감 임박 알림', time: '10분 전', icon: AlertCircle },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setRealtimeData(generateRealtimeData())
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">관리자 대시보드</h1>
              <p className="text-sm text-slate-500 mt-1">Healthcare B2B Platform Analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className={`${isRefreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                리포트 다운로드
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* 실시간 지표 섹션 */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold mb-4">실시간 플랫폼 현황</h2>
                <div className="grid grid-cols-4 gap-8">
                  <div>
                    <p className="text-blue-100 text-sm">활성 사용자</p>
                    <p className="text-3xl font-bold">
                      <CountUp end={realtimeData.activeUsers} duration={1} />
                      <span className="text-sm ml-1">명</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">진행중인 입찰</p>
                    <p className="text-3xl font-bold">
                      <CountUp end={realtimeData.ongoingBids} duration={1} />
                      <span className="text-sm ml-1">건</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">오늘 거래액</p>
                    <p className="text-3xl font-bold">
                      <CountUp end={realtimeData.todayRevenue} duration={1} separator="," prefix="₩" />
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">전환율</p>
                    <p className="text-3xl font-bold">
                      {realtimeData.conversionRate}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-100">실시간</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* KPI 카드 */}
        <div className="grid grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">{kpi.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                      {kpi.isCurrency ? (
                        <CountUp
                          end={kpi.value}
                          duration={2}
                          separator=","
                          prefix="₩"
                          decimals={0}
                        />
                      ) : (
                        <>
                          <CountUp end={kpi.value} duration={2} decimals={kpi.suffix ? 1 : 0} />
                          {kpi.suffix}
                        </>
                      )}
                    </p>
                    <div className="flex items-center mt-2">
                      {kpi.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ml-1 ${
                        kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {Math.abs(kpi.change)}%
                      </span>
                      <span className="text-xs text-slate-400 ml-2">vs 지난달</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-3 gap-6">
          {/* 매출 추이 차트 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-2"
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">매출 및 프로젝트 추이</h3>
                <div className="flex gap-2">
                  {['6M', '3M', '1M'].map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value: any) => {
                      if (typeof value === 'number' && value > 1000000) {
                        return `₩${(value / 100000000).toFixed(1)}억`
                      }
                      return value
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)"
                    name="매출(원)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="projects" 
                    stroke="#8B5CF6" 
                    fillOpacity={1} 
                    fill="url(#colorProjects)"
                    name="프로젝트 수"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* 카테고리별 분포 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">카테고리별 프로젝트</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-sm text-slate-600">{cat.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* 두 번째 차트 행 */}
        <div className="grid grid-cols-3 gap-6">
          {/* 입찰 경쟁률 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">카테고리별 입찰 경쟁률</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={competitionData}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar name="경쟁률" dataKey="경쟁률" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* 사용자 성장 추이 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">주간 사용자 증가</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="buyers" fill="#10B981" name="구매자" />
                  <Bar dataKey="suppliers" fill="#F59E0B" name="공급자" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* 지역별 현황 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">지역별 활동</h3>
              <div className="space-y-3">
                {regionData.map((region, index) => (
                  <div key={region.region} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{region.region}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{region.projects}건</Badge>
                      <span className="text-sm font-semibold text-slate-900">
                        ₩{(region.value / 100000000).toFixed(0)}억
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* 실시간 활동 피드 & AI 인사이트 */}
        <div className="grid grid-cols-3 gap-6">
          {/* 실시간 활동 피드 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="col-span-2"
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">실시간 활동</h3>
                <Badge variant="outline" className="animate-pulse">
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {activityFeed.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'project' ? 'bg-blue-100' :
                        activity.type === 'bid' ? 'bg-green-100' :
                        activity.type === 'award' ? 'bg-purple-100' :
                        activity.type === 'user' ? 'bg-orange-100' :
                        'bg-red-100'
                      }`}>
                        <activity.icon className={`h-4 w-4 ${
                          activity.type === 'project' ? 'text-blue-600' :
                          activity.type === 'bid' ? 'text-green-600' :
                          activity.type === 'award' ? 'text-purple-600' :
                          activity.type === 'user' ? 'text-orange-600' :
                          'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">{activity.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          {/* AI 인사이트 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-900">AI 인사이트</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">성장 기회 발견</p>
                      <p className="text-xs text-slate-500 mt-1">
                        의료 IT 카테고리에서 지난주 대비 32% 입찰 증가
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">주의 필요</p>
                      <p className="text-xs text-slate-500 mt-1">
                        3개 프로젝트가 24시간 내 마감 예정
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">목표 달성률</p>
                      <p className="text-xs text-slate-500 mt-1">
                        월간 목표의 87% 달성, 예상보다 12% 초과
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-2">추천 액션</p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• 의료 IT 카테고리 마케팅 강화</li>
                    <li>• 마감 임박 프로젝트 알림 발송</li>
                    <li>• 신규 공급업체 온보딩 프로세스 개선</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* 하단 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div className="grid grid-cols-5 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  <CountUp end={24} duration={2} />시간
                </p>
                <p className="text-sm text-slate-300 mt-1">평균 응답 시간</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  <CountUp end={98.7} duration={2} decimals={1} />%
                </p>
                <p className="text-sm text-slate-300 mt-1">플랫폼 가동률</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  <CountUp end={4.8} duration={2} decimals={1} />/5
                </p>
                <p className="text-sm text-slate-300 mt-1">사용자 만족도</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  <CountUp end={152} duration={2} />
                </p>
                <p className="text-sm text-slate-300 mt-1">오늘 신규 가입</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  ₩<CountUp end={2.5} duration={2} decimals={1} />B
                </p>
                <p className="text-sm text-slate-300 mt-1">예상 월 거래액</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
export const DEMO_PROJECTS = [
  {
    title: "MRI 장비 구매 건",
    category: "의료기기",
    region: "서울",
    budget_range: "5억-10억",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    requirements: "3T MRI 장비, 설치 및 교육 포함, 5년 무상 AS 필수",
    status: "open" as const
  },
  {
    title: "병원 전산 시스템 구축",
    category: "IT 서비스",
    region: "경기",
    budget_range: "1억-3억",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 45 days from now
    requirements: "EMR/OCS 통합 시스템, 기존 시스템 데이터 마이그레이션 포함",
    status: "open" as const
  },
  {
    title: "수술실 장비 일괄 구매",
    category: "의료기기",
    region: "부산",
    budget_range: "10억-15억",
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days from now
    requirements: "수술실 3개 리노베이션, 최신 수술 장비 일괄 구매",
    status: "open" as const
  },
  {
    title: "의약품 연간 공급 계약",
    category: "의약품",
    region: "대구",
    budget_range: "20억-30억",
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
    requirements: "종합병원 의약품 연간 공급, 월별 분할 납품",
    status: "open" as const
  },
  {
    title: "병원 보안 시스템 구축",
    category: "IT 서비스",
    region: "인천",
    budget_range: "5천만-1억",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 20 days from now
    requirements: "CCTV, 출입통제, 통합 보안 관제 시스템",
    status: "open" as const
  }
]

export const DEMO_BIDS = [
  {
    supplier_name: "메디칼솔루션(주)",
    price: 750000000,
    delivery_days: 60,
    comment: "GE Healthcare 최신 3T MRI, 설치 및 교육 포함, 5년 무상 AS 제공",
    score: 85
  },
  {
    supplier_name: "헬스케어테크(주)",
    price: 680000000,
    delivery_days: 45,
    comment: "Siemens Healthineers MAGNETOM Vida, 빠른 설치 가능, 전문 교육팀 보유",
    score: 92
  },
  {
    supplier_name: "바이오메드(주)",
    price: 820000000,
    delivery_days: 50,
    comment: "Philips Ingenia Elition 3.0T, 최고 사양, 10년 장기 서비스 계약 가능",
    score: 78
  },
  {
    supplier_name: "디지털헬스(주)",
    price: 150000000,
    delivery_days: 90,
    comment: "자체 개발 EMR/OCS 시스템, 맞춤형 커스터마이징 가능",
    score: 88
  },
  {
    supplier_name: "스마트케어(주)",
    price: 180000000,
    delivery_days: 75,
    comment: "클라우드 기반 통합 의료 정보 시스템, 실시간 백업 지원",
    score: 90
  }
]

export const SAMPLE_NOTIFICATIONS = [
  {
    type: "new_project",
    title: "새로운 프로젝트가 등록되었습니다",
    message: "MRI 장비 구매 건이 등록되었습니다. 지금 확인해보세요!",
    read: false
  },
  {
    type: "new_bid",
    title: "새로운 응찰이 접수되었습니다",
    message: "메디칼솔루션(주)에서 귀하의 프로젝트에 응찰했습니다.",
    read: false
  },
  {
    type: "bid_accepted",
    title: "응찰이 선정되었습니다",
    message: "축하합니다! 귀하의 응찰이 최종 선정되었습니다.",
    read: true
  },
  {
    type: "deadline_reminder",
    title: "마감일 임박 알림",
    message: "병원 전산 시스템 구축 프로젝트 마감이 3일 남았습니다.",
    read: false
  }
]

import { SupabaseClient } from '@supabase/supabase-js'

export async function generateSampleData(supabase: SupabaseClient, userId: string, role: 'buyer' | 'supplier') {
  try {
    if (role === 'buyer') {
      // Create sample projects for buyer
      const projectsToInsert = DEMO_PROJECTS.slice(0, 3).map(project => ({
        ...project,
        user_id: userId
      }))

      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .insert(projectsToInsert)
        .select()

      if (projectError) {
        console.error('Error creating sample projects:', projectError)
        return
      }

      // Create sample bids for the first project
      if (projects && projects.length > 0) {
        const firstProjectId = projects[0].id
        
        // Get sample supplier IDs
        const { data: suppliers } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'supplier')
          .eq('is_demo', true)
          .limit(3)

        if (suppliers && suppliers.length > 0) {
          const bidsToInsert = DEMO_BIDS.slice(0, 3).map((bid, index) => ({
            project_id: firstProjectId,
            supplier_id: suppliers[index % suppliers.length].id,
            price: bid.price,
            delivery_days: bid.delivery_days,
            comment: bid.comment,
            score: bid.score,
            status: 'submitted'
          }))

          await supabase.from('bids').insert(bidsToInsert)
        }
      }
    } else {
      // For suppliers, just show available projects (already created by demo buyers)
      // No need to create additional data
    }

    // Create sample notifications
    const notificationsToInsert = SAMPLE_NOTIFICATIONS.slice(0, 2).map(notification => ({
      ...notification,
      user_id: userId
    }))

    await supabase.from('notifications').insert(notificationsToInsert)

  } catch (error) {
    console.error('Error generating sample data:', error)
  }
}
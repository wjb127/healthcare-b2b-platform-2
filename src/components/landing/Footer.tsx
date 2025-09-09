import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    서비스: ["거래 플랫폼", "가격 분석", "재고 관리", "에스크로"],
    회사: ["회사 소개", "채용", "파트너십", "뉴스"],
    지원: ["고객센터", "이용약관", "개인정보처리방침", "FAQ"],
    문의: ["contact@healthcare-b2b.com", "02-1234-5678", "서울시 강남구"],
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              Healthcare B2B
            </h3>
            <p className="text-slate-400 mb-4">
              헬스케어 산업의 디지털 혁신을 선도하는
              <br />
              신뢰할 수 있는 B2B 거래 플랫폼
            </p>
            <div className="flex items-center gap-2 text-teal-400">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Building healthier tomorrow</span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm hover:text-teal-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © {currentYear} Healthcare B2B Platform. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
              >
                이용약관
              </a>
              <a
                href="#"
                className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
              >
                개인정보처리방침
              </a>
              <a
                href="#"
                className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
              >
                쿠키 정책
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
import Link from 'next/link';
import { BandLogo } from '@/components/BandLogo';

const NAV_CARDS = [
  {
    href: '/schedule',
    icon: '📅',
    title: '개인 일정 등록',
    desc: '합주에 참여하기 어려운 날짜를 등록하세요.',
  },
  {
    href: '/planner',
    icon: '⚙️',
    title: '합주 일정 배분',
    desc: '팀별·곡별로 합주를 자동으로 배정합니다.',
  },
  {
    href: '/calendar',
    icon: '🗓️',
    title: '합주 캘린더',
    desc: '남은 합주 일정을 달력으로 확인하세요.',
  },
];

export default function LandingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 py-6">
        <BandLogo size={72} className="mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">합주 매니저</h1>
        <p className="text-gray-500 text-base">밴드 멤버들의 합주 일정 관리와 공연 준비를 한 곳에서</p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 gap-3">
        {NAV_CARDS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-purple-300 hover:shadow-md transition"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <span className="ml-auto text-gray-300 text-lg">›</span>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link
          href="/planner"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl px-8 py-3 text-sm transition shadow-sm"
        >
          합주 일정 잡기
        </Link>
      </div>
    </div>
  );
}

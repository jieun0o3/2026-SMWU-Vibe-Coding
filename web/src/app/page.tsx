import Link from 'next/link';
import RehearsalTodayBanner from '@/components/RehearsalTodayBanner';

export default function LandingPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      <RehearsalTodayBanner />

      <div className="text-center space-y-3 py-4">
        <h1 className="text-4xl font-bold text-indigo-700">🎸 합주 매니저</h1>
        <p className="text-gray-500 text-lg">밴드 멤버들의 합주 일정 관리와 공연 준비를 한 곳에서</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { href: '/schedule', title: '개인 일정 등록', desc: '합주에 참여하기 어려운 날짜를 등록하세요.', icon: '📅' },
          { href: '/planner', title: '합주 일정 배분', desc: '공연 날짜를 기준으로 합주를 자동으로 배정합니다.', icon: '⚙️' },
          { href: '/calendar', title: '합주 캘린더', desc: '남은 합주 일정을 달력으로 확인하세요.', icon: '🗓️' },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="block border rounded-xl p-5 bg-white hover:border-indigo-400 hover:shadow-sm transition">
            <p className="font-semibold text-indigo-700">{item.icon} {item.title}</p>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link href="/planner" className="inline-block bg-indigo-600 text-white rounded-lg px-8 py-3 font-medium hover:bg-indigo-700 transition">
          합주 일정 잡기
        </Link>
      </div>
    </div>
  );
}

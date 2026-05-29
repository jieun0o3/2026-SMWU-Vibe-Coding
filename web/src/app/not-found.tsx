import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl font-bold text-purple-600 mb-4">404</div>
      <h1 className="text-xl font-semibold text-gray-800 mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-500 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Link
        href="/"
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

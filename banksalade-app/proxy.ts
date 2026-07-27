import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 공격 시도에 자주 사용되는 패턴들
const MALICIOUS_PATTERNS = [
  /\.php/,
  /\.cgi/,
  /cgi-bin/,
  /vendor/,
  /phpunit/,
  /bin\/sh/,
  /think\\app/,
  /eval-stdin/,
  /allow_url_include/,
  /auto_prepend_file/,
  /pearcmd/,
  /\.env/,
  /\.git/,
  /boaform/,
  /admin\/formLogin/,
  /setup\.cgi/,
  /developmentserver/,
  /zc\?action/,
  /ReportServer/,
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const method = request.method;

  // 요청 경로(pathname) 또는 쿼리 스트링(search)에서 악성 패턴 검사
  const isMalicious = MALICIOUS_PATTERNS.some((pattern) => 
    pattern.test(pathname) || pattern.test(search)
  );

  // 잘못된 Server Action 호출 시도 차단 (헤더에 next-action이 있는데 비정상적인 경우)
  const hasNextAction = request.headers.has('next-action');
  
  if (isMalicious || (method === 'POST' && hasNextAction && pathname === '/')) {
    // 공격 시도인 경우 바로 404를 응답하여 서버 리소스 보호
    console.warn(`[Blocked] ${isMalicious ? 'Malicious request' : 'Invalid Server Action'}: [${method}] ${pathname}${search}`);
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

// 프록시가 실행될 경로 설정 (모든 경로에서 실행하되, 정적 파일은 제외)
export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 요청에 대해 프록시 실행:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘)
     * - public 폴더 내 이미지 파일 등
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
};

// 이 파일은 브라우저에서 Supabase 클라이언트 초기화를 위한 공개 키를 주입합니다.
// 실제 값은 GitHub Pages 배포 시, GitHub Actions가 secrets에서 치환하도록 합니다.
// 로컬 개발 시에는 아래 값을 직접 채워 테스트할 수 있습니다.

window.SUPABASE_URL = window.SUPABASE_URL || 'YOUR_SUPABASE_URL';
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';



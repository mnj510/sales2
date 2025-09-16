## 매출 관리 시스템 (Static + Supabase + GitHub Pages)

### 개요
- 정적 HTML로 구성된 매출/상품/지출 관리 대시보드
- 데이터 저장은 Supabase(Postgres + Row Level Security)
- Chart.js 시각화, 반응형 상단 탭 네비게이션
- GitHub Pages로 자동 배포 (Actions)

### 준비물
1) Supabase 프로젝트 생성 후 Project URL과 anon public key 확보
2) 아래 SQL로 테이블 및 정책 생성
3) GitHub Repository 생성 후 Secrets 등록: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

### DB 스키마(SQL)
```sql
-- 테이블
create table if not exists platforms (
  id bigint generated always as identity primary key,
  business_number text not null,
  name text not null,
  fee numeric not null default 0
);
create table if not exists products (
  id bigint generated always as identity primary key,
  business_number text not null,
  name text not null,
  cost numeric not null default 0,
  category text default '',
  platform text not null,
  price numeric not null default 0,
  matching text[]
);
create table if not exists sales (
  id bigint generated always as identity primary key,
  business_number text not null,
  date date not null,
  platform text not null,
  product_name text not null,
  price numeric not null,
  quantity int not null,
  cost numeric default 0,
  shipping numeric default 0,
  option text default '',
  order_number text default '',
  registered_at timestamptz default now()
);
create table if not exists expenses (
  id bigint generated always as identity primary key,
  business_number text not null,
  date date not null,
  type text not null check (type in ('사업','개인')),
  category text not null,
  amount numeric not null,
  description text default '',
  registered_at timestamptz default now()
);

-- 인덱스 (조회 최적화)
create index if not exists idx_sales_bn_date on sales(business_number, date);
create index if not exists idx_expenses_bn_date on expenses(business_number, date);
create index if not exists idx_products_bn on products(business_number);
create index if not exists idx_platforms_bn on platforms(business_number);
```

### RLS 정책(예시)
- 본 프로젝트는 간단히 `business_number` 컬럼로 멀티 테넌시를 분리합니다.
- Supabase Auth를 사용하지 않고, 프론트에서 사업자번호를 키로 사용하므로 엄격한 보안 환경이 필요한 경우 Auth 연동을 권장합니다.

```sql
alter table platforms enable row level security;
alter table products enable row level security;
alter table sales enable row level security;
alter table expenses enable row level security;

-- 데모 정책: 모든 읽기 허용, 작성/수정/삭제는 business_number가 포함된 레코드만 허용
create policy read_all_platforms on platforms for select using (true);
create policy write_platforms on platforms for insert with check (true);
create policy update_platforms on platforms for update using (true);
create policy delete_platforms on platforms for delete using (true);

create policy read_all_products on products for select using (true);
create policy write_products on products for insert with check (true);
create policy update_products on products for update using (true);
create policy delete_products on products for delete using (true);

create policy read_all_sales on sales for select using (true);
create policy write_sales on sales for insert with check (true);
create policy update_sales on sales for update using (true);
create policy delete_sales on sales for delete using (true);

create policy read_all_expenses on expenses for select using (true);
create policy write_expenses on expenses for insert with check (true);
create policy update_expenses on expenses for update using (true);
create policy delete_expenses on expenses for delete using (true);
```

주의: 위 정책은 공개 웹사이트에 적합하지 않을 수 있습니다. 실제 서비스에서는 Supabase Auth로 사용자 인증 후 JWT 내 클레임과 매핑하여 `business_number`를 검증하는 정책으로 강화하세요.

### 환경변수 주입
- `env.js`는 빌드가 필요 없는 정적 파일로, GitHub Actions가 secrets로 치환합니다.
- 로컬 테스트 시 `env.js`의 `YOUR_SUPABASE_URL`, `YOUR_SUPABASE_ANON_KEY`를 실제 값으로 바꿔주세요.

### 배포(자동)
- 기본 브랜치 `main`에 push 시 GitHub Pages로 자동 배포됩니다.
- 배포 URL은 리포지토리의 Pages 설정에서 확인 가능합니다.

### 로컬 실행
- 정적이므로 파일을 브라우저로 열면 동작합니다. CORS 문제 없음.

### 기능
- 플랫폼/상품/매출/지출 CRUD (Supabase)
- 대시보드/리포트: 월별/일별/플랫폼별 매출, 수익률 및 순익
- 반응형 상단 탭 네비, 모바일 최적화



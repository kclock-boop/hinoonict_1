# 통신현장 작업일보 v1.0

정보통신공사용 작업일보 작성·문서 등록·현장별 조회 프로그램입니다.

## 먼저 알아두세요
- **설치 가능한 소스와 빌드 결과물**입니다. 실제 GitHub 저장소 업로드, Netlify 배포, Supabase 프로젝트 연결은 아직 실행하지 않았습니다.
- 서버 설정 전에는 **체험 모드**로 동작합니다. 체험 자료는 현재 브라우저 localStorage와 IndexedDB에만 보관됩니다. 실제 업무자료는 연결 후 입력하세요.
- 자동작성은 입력 항목을 정해진 문장으로 편집하는 기능입니다. 외부 생성형 AI를 호출하지 않습니다.
- 문서 등록은 원본 보관 기능입니다. UTF-8 TXT·CSV(1MB 이하)만 첫 작업내용으로 불러올 수 있으며, CSV 표의 열을 자동 매핑하지 않습니다. PDF·HWP·HWPX·DOCX·XLSX·스캔 사진의 텍스트 추출/OCR/자동학습은 지원하지 않습니다.
- 발주처의 특정 일보 양식과 같다고 보장하지 않습니다. 기존 양식을 제공하면 별도 맞춤화할 수 있습니다.

## 제공 기능
1. 여러 현장 등록: 공사명, 발주처, 시공사, 주소, 현장대리인.
2. 공종별 기록: 구내통신, 광케이블, CCTV, 방송, 출입통제, 네트워크, 배관·배선, 시험·검측.
3. 계획·실적 수량과 단위, 투입인원·시간·휴게시간 및 인시 계산. 단위가 다른 공종의 수량을 합산하지 않고 공종별 달성률을 문장으로 제공합니다.
4. 자재 사용수량, 장비, 품질시험·검측, TBM·보호구·전기위험·고소작업 점검, 위험조치, 변경·지연사유, 익일계획.
5. 입력기록으로 종합문장 생성 및 직접 수정. 기록을 변경하면 자동작성을 다시 실행해야 합니다.
6. Word(.docx) 다운로드, 인쇄/PDF 저장, 조회결과 CSV, 개별 일보 JSON 다운로드.
7. 관련 문서·사진 등록 및 다운로드(파일당 10MB). 현장사진은 Word와 인쇄본에 포함하며 원본 첨부파일 자체를 Word에 내장하지 않습니다.
8. 현장·월·키워드 조회, 문서함, 익일복사(실적·안전점검·자재·첨부 초기화).
9. Supabase 이메일 로그인, 비밀번호 변경, 회사 단위 admin/editor/viewer 권한. admin/editor는 모든 회사 현장을 작성·조회·삭제할 수 있고 viewer는 조회·다운로드만 가능합니다. 권한 관리는 SQL Editor에서만 수행합니다.
10. 낙관적 버전 잠금으로 동시수정 덮어쓰기 방지. 충돌 시 JSON으로 현재 입력을 먼저 내려받고 이력에서 다시 열어 비교하세요.

## 추천 구성
| 서비스 | 담당 | 판단 |
|---|---|---|
| GitHub 비공개 저장소 | 소스·변경이력·복구 | 현재 계획 유지 권장 |
| Netlify | 웹화면 배포·HTTPS·GitHub 자동배포 | 현재 계획 유지 권장 |
| Supabase Auth/Database/Storage | 로그인·회사별 자료격리·일보·비공개 파일 | 현재 계획 유지 권장 |

지금 규모에서는 서비스 추가보다 이 구성을 단순하게 유지하는 것이 좋습니다. 향후 AI/OCR은 Netlify Functions 또는 Supabase Edge Functions 중 한 곳에 구현하여 비밀키와 원문 처리 정책을 관리하는 방향을 권장합니다. 이 버전에는 AI API 비용이 발생하지 않습니다. 각 서비스 요금·제한은 사용량과 플랜에 따라 확인하세요.

## 1단계: PC에서 실행
Node.js 22 이상을 설치하고 압축을 풉니다. 프로젝트 폴더에서 터미널을 열고 실행합니다.

```bash
npm ci
npm run dev
```

터미널의 http://127.0.0.1:5173 주소를 엽니다. index.html을 더블클릭하는 실행 방식은 지원하지 않습니다. 서버 설정이 없어도 체험할 수 있습니다. 즉시 배포용 파일은 `dist/`에 있으며 Netlify 수동 배포 시 이 폴더를 올리면 됩니다.

## 2단계: GitHub 업로드
1. GitHub Desktop → File → Add local repository에서 프로젝트 폴더를 선택합니다.
2. 저장소가 아니라면 Create a repository here를 선택합니다.
3. 이름 예: `telecom-fieldlog`.
4. Commit 후 Publish repository. 기업용이면 Keep this code private를 선택합니다.
5. 소스·package-lock.json·netlify.toml·supabase 폴더를 올립니다. node_modules, .env, dist, 실제 공사자료는 올리지 않습니다.

## 3단계: Supabase 준비
1. 기업용으로 사용할 Supabase 프로젝트를 생성합니다. 기존 기업 DB가 아닌 새 프로젝트에서 먼저 설치하는 것을 권장합니다.
2. SQL Editor → New query → `supabase/setup.sql` 전체를 복사하여 최초 1회 실행합니다. 기존 테이블이 있는 프로젝트에서 반복 실행하는 파일이 아닙니다.
3. Authentication → Users → Add user에서 관리자 이메일과 안전한 비밀번호로 계정을 생성합니다. Invite 대신 Create user로 생성하는 경우 이메일 확인 상태도 확인하세요. 일반 공개 회원가입은 사용하지 않아도 됩니다.
4. `supabase/register-team.sql`의 `admin@example.com`과 회사명을 실제 값으로 바꾸어 실행합니다. 실행 결과 회사 UUID를 기록합니다. 같은 파일을 반복 실행하면 회사가 새로 생깁니다.
5. 직원 계정도 Authentication에서 생성합니다. 파일 하단의 추가 직원 SQL 주석을 해제하고 회사 UUID와 이메일을 바꿔 실행합니다. 입력 가능한 직원은 editor, 조회만 하는 직원은 viewer입니다.
6. Project Settings 또는 Connect 화면에서 **Project URL**과 **publishable key**를 복사합니다. URL은 `https://프로젝트ID.supabase.co` 형태이며 `/rest/v1`을 붙이지 않습니다. service_role/secret key는 사용하지 않습니다.
7. 로그인 후 현장을 등록합니다. 등록한 회사 안에서 현장을 공유합니다. 이 버전은 개별 현장별 멤버 제한, 외주업체 분리, 결재선 기능을 제공하지 않습니다.

로컬 연결은 `.env.example`을 `.env`로 복사한 뒤 값을 채우고 개발서버를 다시 시작하면 됩니다. .env는 Git에 올리지 않습니다.

## 4단계: Netlify 연결·배포
1. Add new project → Import an existing project → GitHub에서 저장소를 선택합니다.
2. Build command: `npm run build`, Publish directory: `dist`, Node: `22`.
3. Environment variables에 다음 두 값을 추가합니다(빌드 환경에서 사용).
   - `VITE_SUPABASE_URL`: Project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: publishable key
4. Deploy를 실행합니다. 환경변수를 수정했다면 새로 빌드·배포해야 합니다.
5. 배포주소에서 연결·사용안내 → 관리자 이메일 로그인 → 현장 등록 → 일보 작성.
6. 필요하면 Supabase Authentication의 Site URL에 Netlify 배포주소를 등록합니다. 현재는 이메일·비밀번호 로그인만 사용합니다.

브라우저에 포함되는 publishable key 자체는 비밀키가 아닙니다. 실제 보안은 로그인·회사멤버십·RLS·비공개 Storage 정책이 담당합니다. Netlify URL에 접속할 수 있는 것과 기업 데이터를 읽을 수 있는 것은 구분됩니다.

## 사용 예
1. 현장: 창원 사무실 통신공사 / 작성자: 홍길동 / 투입인원: 4명.
2. 작업 1: 3층 UTP 포설, 계획 500m, 실적 420m.
3. 작업 2: 주차장 CCTV 설치, 계획 6대, 실적 6대.
4. 시험: 12회선 도통시험 적합. 안전: 사다리 2인 1조 및 TBM 실시.
5. 자동작성 → 문장과 미리보기 확인 → 일보 저장 → 사진·시험성적서 등록.
6. Word 다운로드 또는 인쇄/PDF 저장. PDF는 인쇄 대화상자의 대상을 PDF로 저장으로 선택합니다.

작업일의 기본값은 한국시간 기준입니다. 08:00~17:00, 휴게 60분, 4명일 때 작업시간 8시간, 인시 32입니다. 야간작업은 날짜별로 나누어 작성합니다. 기상정보는 직접 선택하며 실제 기상 API 연동은 없습니다.

## 보관과 제한
- 작성완료는 자체 작성 상태이며 전자서명·승인·법정 보존을 보장하지 않습니다. 완료 후 수정도 가능합니다.
- 수정자별 감사이력·백업 복원 화면·오프라인 공동 동기화는 포함하지 않았습니다. JSON은 개별 데이터 보관용이며 화면에서 JSON 복원은 지원하지 않습니다.
- 일보 삭제 시 연결된 파일 원본은 Storage에 남습니다. 보관기간을 정하고 관리자가 정기 정리하세요. 업로드와 일보 연결은 하나의 트랜잭션이 아니므로 연결 실패 시에도 고아 파일이 남을 수 있습니다.
- 첨부파일 검사는 확장자·크기를 기준으로 하며 악성코드 검사 기능은 없습니다. 서버 강제 MIME 검증, 보안 스캔, 대용량 사진 최적화는 후속 고도화 대상입니다.
- 회사별 멤버십만 관리자 SQL로 관리합니다. 사용자 본인의 메타데이터로 권한을 부여하지 않습니다. RLS는 anon 데이터 접근을 허용하지 않습니다.
- 대규모 운영 전 현장별 서버 페이지 조회·보관정책·재해복구·담당자 검수 및 양식 확정이 필요합니다.

## 검증 방법
```bash
npm test
npm run test:db
npm run test:e2e
npm run build
```

브라우저 테스트 실행 시 `playwright.config.js`의 executablePath는 Linux `/usr/bin/chromium` 기준입니다. 다른 환경에서는 해당 옵션을 제거하고 `npx playwright install chromium`으로 테스트 브라우저를 설치하세요.

실행 결과와 실제 서비스 미검증 항목은 `검증결과.txt`를 확인하세요.

## 조사 근거와 반영
- CODIL 정보통신공사 일반 시방자료: 품질시험·품질관리 및 시공 후 검사할 수 없는 부분의 확인 기록 취지를 참고해 시험·검측·사진·도면 보관 항목을 설계했습니다. PDF 원문 전문 대조는 완료하지 않았으며 공개 검색에 노출된 자료를 근거로 기능을 제안했습니다.
  https://www.codil.or.kr/filebank/construction/OS/CIGCOS610005/CIGCOS610005.pdf
- CODIL 정보통신공사 안전관리 시방자료: 현장 안전관리·시정조치 기록 취지를 참고했습니다. 이는 특정 사업장 법적 준수 판정이나 법정서식이 아닙니다.
  https://www.codil.or.kr/filebank/construction/OS/CIGCOSC90022/CIGCOSC90022.pdf
- Supabase 공식 문서: 로그인, RLS, 비공개 Storage·다운로드 구성.
  https://supabase.com/docs/reference/javascript/auth-signinwithpassword
  https://supabase.com/docs/guides/database/postgres/row-level-security
  https://supabase.com/docs/guides/storage/security/access-control
  https://supabase.com/docs/guides/storage/serving/downloads
- Netlify 공식 문서: Git 기반 배포와 빌드 환경변수.
  https://docs.netlify.com/deploy/deploy-overview/
  https://docs.netlify.com/build/environment-variables/get-started/

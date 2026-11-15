-- 1) Authentication > Users > Add user로 계정을 생성합니다.
-- 2) 아래 이메일과 회사명을 실제 값으로 바꾸고 SQL Editor에서 실행합니다.
-- 관리자는 SQL Editor를 통해서만 권한을 부여하며, 일반 사용자는 권한을 바꿀 수 없습니다.
do $$
declare team_id uuid; account_id uuid;
begin
 select id into account_id from auth.users where email='admin@example.com';
 if account_id is null then raise exception 'Authentication에서 해당 이메일의 계정을 먼저 생성하세요';end if;
 insert into public.workspaces(name) values('우리 정보통신') returning id into team_id;
 insert into public.memberships(workspace_id,user_id,role) values(team_id,account_id,'admin');
 raise notice '회사 ID: %',team_id;
end $$;
-- 추가 직원: 아래 UUID와 이메일을 바꾸고 필요한 줄만 실행하세요.
-- insert into public.memberships(workspace_id,user_id,role)
-- select '회사_UUID'::uuid,id,'editor' from auth.users where email='worker@example.com';
-- 읽기 전용은 editor 대신 viewer 사용. 같은 회사에 등록된 모든 현장을 볼 수 있습니다.

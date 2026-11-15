import {test} from 'node:test';import assert from 'node:assert/strict';import {blank,metrics,validate,summarize,csvCell,escapeHtml} from '../src/domain.js';
const valid=()=>({...blank(),author:'홍길동',tasks:[{type:'광케이블',location:'MDF실',detail:'광접속',planned:10,actual:8,unit:'코어'}]});
test('휴게시간을 빼고 인시를 계산한다',()=>{assert.equal(metrics(valid()).hours,8);assert.equal(metrics(valid()).manhours,32);});
test('다른 단위 수량을 합하지 않고 공종별 달성률을 작성한다',()=>{const r=valid();r.tasks.push({type:'CCTV',location:'주차장',detail:'설치',planned:2,actual:2,unit:'대'});const s=summarize(r,{name:'현장'});assert.match(s,/80.0%/);assert.match(s,/100.0%/);assert.match(s,/미기재/);});
test('미입력과 잘못된 시간·음수 수량을 거부한다',()=>{assert.throws(()=>validate(blank()));let r=valid();r.end='07:00';assert.throws(()=>validate(r));r=valid();r.tasks[0].actual=-1;assert.throws(()=>validate(r));});
test('문서 입력의 HTML 및 CSV 수식 주입 방지',()=>{assert.equal(escapeHtml('<img>'),'&lt;img&gt;');assert.equal(csvCell('=HYPERLINK("a")'),'"\'=HYPERLINK(""a"")"');assert.equal(csvCell('\n+1'),'"\'\n+1"');});

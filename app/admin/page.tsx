import { requireAdmin } from "./auth";
import { logout, deleteInquiryAction } from "./actions";
import { listInquiries, storeMode, STATUS_LABEL, STATUSES, type Inquiry, type InquiryStatus } from "../inquiries";
import ConfirmSubmit from "./confirm-submit";
import InquiryControls from "./inquiry-controls";

const STATUS_OPTIONS = STATUSES.map((s): [string, string] => [s, STATUS_LABEL[s]]);
const TABS: [string, string][] = [["all", "전체"], ...STATUS_OPTIONS];
const fmt = new Intl.DateTimeFormat("ko-KR", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Seoul" });
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }); // en-CA formats as YYYY-MM-DD
const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "Asia/Seoul" });
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CHART_DAYS = 30;

type SearchParams = { status?: string; q?: string; date?: string };

function viewHref({ status, q, date }: SearchParams): string {
  const p = new URLSearchParams();
  if (status && status !== "all") p.set("status", status);
  if (q) p.set("q", q);
  if (date) p.set("date", date);
  return p.toString() ? `/admin?${p}` : "/admin";
}

const dayOf = (iso: string) => dayKey.format(new Date(iso));
const dayLabel = (d: string) => `${Number(d.slice(5, 7))}월 ${Number(d.slice(8))}일 (${weekday.format(new Date(`${d}T00:00:00+09:00`))})`;

// last CHART_DAYS dates in KST, oldest first (KST has no DST, so 24h steps are exact)
function recentDays(): string[] {
  const now = Date.now();
  return Array.from({ length: CHART_DAYS }, (_, i) => dayKey.format(now - (CHART_DAYS - 1 - i) * 86_400_000));
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const { status, q, date: rawDate } = await searchParams;
  const date = rawDate && DATE_RE.test(rawDate) ? rawDate : undefined;
  const mode = storeMode();

  if (mode === "unconfigured") {
    return (
      <main className="ad-page">
        <TopBar />
        <p className="ad-setup">
          Supabase가 아직 연결되지 않았습니다. <code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code> 환경변수를 설정하고{" "}
          <code>supabase/inquiries.sql</code>을 실행해 주세요.
        </p>
      </main>
    );
  }

  let list: Inquiry[] = [];
  let loadError = "";
  try {
    list = await listInquiries({ q: q?.trim() || undefined });
  } catch {
    loadError = "문의 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }

  const perDay = new Map<string, number>();
  for (const item of list) {
    const d = dayOf(item.created_at);
    perDay.set(d, (perDay.get(d) ?? 0) + 1);
  }
  const dated = date ? list.filter((i) => dayOf(i.created_at) === date) : list;

  const counts: Record<string, number> = Object.fromEntries([["all", dated.length], ...STATUSES.map((s) => [s, 0])]);
  for (const item of dated) counts[item.status]++;
  const activeStatus = STATUSES.includes(status as InquiryStatus) ? (status as InquiryStatus) : "all";
  const shown = activeStatus === "all" ? dated : dated.filter((i) => i.status === activeStatus);

  return (
    <main className="ad-page">
      {mode === "local" && <p className="ad-banner">로컬 저장소(개발용)입니다. 배포 전에 Supabase를 연결해 주세요.</p>}
      <TopBar />

      {!loadError && <DailyChart perDay={perDay} date={date} status={activeStatus} q={q} />}

      <div className="ad-toolbar">
        <ul className="ad-tabs">
          {TABS.map(([id, label]) => (
            <li key={id}>
              <a href={viewHref({ status: id, q, date })} className={activeStatus === id ? "ad-on" : ""}>
                {label} <span>{counts[id]}</span>
              </a>
            </li>
          ))}
        </ul>
        <form className="ad-search" action="/admin">
          {activeStatus !== "all" && <input type="hidden" name="status" value={activeStatus} />}
          <input type="date" name="date" defaultValue={date} max={dayKey.format(Date.now())} aria-label="날짜" />
          <input type="search" name="q" placeholder="이름 또는 연락처 검색" defaultValue={q} />
          <button type="submit">검색</button>
        </form>
      </div>

      {loadError ? (
        <p className="ad-error">{loadError}</p>
      ) : shown.length === 0 ? (
        <p className="ad-empty">문의가 없습니다.</p>
      ) : (
        <table className="ad-table">
          <thead>
            <tr>
              <th>접수일시</th>
              <th>이름</th>
              <th>연락처</th>
              <th>상담 항목</th>
              <th>SMS 동의</th>
              <th>상태</th>
              <th>특이사항</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((item) => {
              const del = deleteInquiryAction.bind(null, item.id);
              return (
                <tr key={item.id}>
                  <td data-label="접수일시">{fmt.format(new Date(item.created_at))}</td>
                  <td data-label="이름">{item.name}</td>
                  <td data-label="연락처"><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                  <td data-label="상담 항목">{item.item}</td>
                  <td data-label="SMS 동의">{item.sms_consent ? "예" : "아니오"}</td>
                  <InquiryControls id={item.id} name={item.name} status={item.status} memo={item.memo} options={STATUS_OPTIONS} />
                  <td data-label="삭제">
                    <form action={del}>
                      <ConfirmSubmit confirmMessage={`${item.name}님의 문의를 삭제할까요? 삭제하면 되돌릴 수 없습니다.`} />
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}

// one bar per KST day; each bar links to that day's list (click the selected bar again to clear)
function DailyChart({ perDay, date, status, q }: { perDay: Map<string, number>; date?: string; status: string; q?: string }) {
  const days = recentDays();
  const values = days.map((d) => perDay.get(d) ?? 0);
  const max = Math.max(1, ...values);
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <section className="ad-chart">
      <div className="ad-chart-head">
        <h2>
          일별 문의 <span>{date ? `${dayLabel(date)} ${perDay.get(date) ?? 0}건` : `최근 ${CHART_DAYS}일 ${total}건`}</span>
        </h2>
        {date && <a href={viewHref({ status, q })}>전체 기간 보기</a>}
      </div>
      <div className="ad-plot">
        <span className="ad-plot-max" aria-hidden="true">{max}</span>
        <span className="ad-plot-zero" aria-hidden="true">0</span>
        <ol className={`ad-bars${date ? " ad-has-on" : ""}`} aria-label={`최근 ${CHART_DAYS}일 일별 문의 수`}>
          {days.map((d, i) => {
            const tip = `${dayLabel(d)} ${values[i]}건`;
            const daysAgo = CHART_DAYS - 1 - i;
            return (
              <li key={d}>
                <a href={viewHref({ status, q, date: d === date ? undefined : d })} className={d === date ? "ad-on" : ""} aria-label={tip} aria-current={d === date ? "date" : undefined} data-tip={tip}>
                  <span style={{ height: `${(values[i] / max) * 100}%` }} />
                </a>
                {daysAgo % 7 === 0 && <small aria-hidden="true">{daysAgo === 0 ? "오늘" : `${Number(d.slice(5, 7))}/${Number(d.slice(8))}`}</small>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function TopBar() {
  return (
    <div className="ad-top">
      <h1>문의 관리</h1>
      <form action={logout}>
        <button type="submit" className="ad-logout">로그아웃</button>
      </form>
    </div>
  );
}

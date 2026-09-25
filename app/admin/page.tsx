import { requireAdmin } from "./auth";
import { logout, updateInquiryAction, deleteInquiryAction } from "./actions";
import { listInquiries, storeMode, STATUS_LABEL, type Inquiry, type InquiryStatus } from "../inquiries";
import ConfirmSubmit from "./confirm-submit";

const STATUSES: InquiryStatus[] = ["new", "in_progress", "done"];
const TABS: [string, string][] = [["all", "전체"], ...STATUSES.map((s): [string, string] => [s, STATUS_LABEL[s]])];
const fmt = new Intl.DateTimeFormat("ko-KR", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Seoul" });

type SearchParams = { status?: string; q?: string };

function tabHref(status: string, q?: string): string {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const { status, q } = await searchParams;
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

  const counts: Record<string, number> = { all: list.length, new: 0, in_progress: 0, done: 0 };
  for (const item of list) counts[item.status]++;
  const activeStatus = STATUSES.includes(status as InquiryStatus) ? (status as InquiryStatus) : "all";
  const shown = activeStatus === "all" ? list : list.filter((i) => i.status === activeStatus);

  return (
    <main className="ad-page">
      {mode === "local" && <p className="ad-banner">로컬 저장소(개발용) — 배포 전 Supabase 연결 필요</p>}
      <TopBar />

      <div className="ad-toolbar">
        <ul className="ad-tabs">
          {TABS.map(([id, label]) => (
            <li key={id}>
              <a href={tabHref(id, q)} className={activeStatus === id ? "ad-on" : ""}>
                {label} <span>{counts[id]}</span>
              </a>
            </li>
          ))}
        </ul>
        <form className="ad-search" action="/admin">
          {activeStatus !== "all" && <input type="hidden" name="status" value={activeStatus} />}
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
              <th>상태 · 메모</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((item) => {
              const update = updateInquiryAction.bind(null, item.id);
              const del = deleteInquiryAction.bind(null, item.id);
              return (
                <tr key={item.id}>
                  <td data-label="접수일시">{fmt.format(new Date(item.created_at))}</td>
                  <td data-label="이름">{item.name}</td>
                  <td data-label="연락처"><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                  <td data-label="상담 항목">{item.item}</td>
                  <td data-label="SMS 동의">{item.sms_consent ? "예" : "아니오"}</td>
                  <td data-label="상태 · 메모">
                    <form action={update} className="ad-row-form">
                      <select name="status" defaultValue={item.status} aria-label={`${item.name} 상태`} className={`ad-chip ad-chip-${item.status}`}>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                      <textarea name="memo" defaultValue={item.memo} maxLength={2000} rows={2} placeholder="메모" aria-label={`${item.name} 메모`} />
                      <button type="submit" className="ad-save">저장</button>
                    </form>
                  </td>
                  <td data-label="삭제">
                    <form action={del}>
                      <ConfirmSubmit label="삭제" confirmMessage={`${item.name}님의 문의를 삭제할까요? 삭제하면 되돌릴 수 없습니다.`} />
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

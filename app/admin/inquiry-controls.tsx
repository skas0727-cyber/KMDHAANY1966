"use client";
import { useEffect, useRef, useState } from "react";
import { updateInquiryAction } from "./actions";

type SaveState = "idle" | "saving" | "saved" | "error";
const SAVE_TEXT: Record<SaveState, string> = { idle: "", saving: "저장 중...", saved: "저장됨", error: "저장하지 못했습니다. 다시 시도해 주세요" };
const MEMO_DELAY_MS = 600; // save this long after typing stops (and immediately on blur)

// status select + 특이사항 cells for one row; both save on change, no save button
export default function InquiryControls({ id, name, status: initialStatus, memo: initialMemo, options }: {
  id: string;
  name: string;
  status: string;
  memo: string;
  options: [string, string][];
}) {
  const [status, setStatus] = useState(initialStatus);
  const [save, setSave] = useState<SaveState>("idle");
  const draft = useRef(initialMemo); // what's in the textarea
  const saved = useRef(initialMemo); // what the server has
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef(0);

  async function persist(patch: { status?: string; memo?: string }): Promise<boolean> {
    const n = ++latest.current;
    setSave("saving");
    const { ok } = await updateInquiryAction(id, patch).catch(() => ({ ok: false }));
    if (n === latest.current) setSave(ok ? "saved" : "error");
    return ok;
  }

  function flushMemo() {
    clearTimeout(timer.current);
    const value = draft.current;
    if (value === saved.current) return;
    persist({ memo: value }).then((ok) => { if (ok) saved.current = value; });
  }

  // unsaved memo: save it if the row unmounts (e.g. status change moves it out of the current tab), warn on tab close
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (draft.current !== saved.current) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => { window.removeEventListener("beforeunload", warn); flushMemo(); };
  }, []);

  return (
    <>
      <td className="ad-c-status">
        <select
          value={status}
          aria-label={`${name} 상태`}
          className={`ad-chip ad-chip-${status}`}
          onChange={(e) => {
            const prev = status;
            setStatus(e.target.value);
            persist({ status: e.target.value }).then((ok) => { if (!ok) setStatus(prev); });
          }}
        >
          {options.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </td>
      <td className="ad-c-memo">
        <textarea
          className="ad-memo"
          defaultValue={initialMemo}
          maxLength={2000}
          rows={2}
          placeholder="특이사항 (입력하면 자동 저장)"
          aria-label={`${name} 특이사항`}
          onChange={(e) => {
            draft.current = e.target.value;
            clearTimeout(timer.current);
            timer.current = setTimeout(flushMemo, MEMO_DELAY_MS);
          }}
          onBlur={flushMemo}
        />
        <p className={`ad-save-state ad-save-${save}`} aria-live="polite">{SAVE_TEXT[save]}</p>
      </td>
    </>
  );
}

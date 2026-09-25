// public inquiry submission endpoint: validates, honeypot-checks, then stores via app/inquiries.ts
import { createInquiry, storeMode } from "../../inquiries";

const MAX_BODY_BYTES = 4096;
const PHONE_RE = /^[0-9-]{9,14}$/;

export async function POST(req: Request) {
  // JSON only: forces a CORS preflight, so other sites can't make visitors' browsers submit here
  if (!req.headers.get("content-type")?.startsWith("application/json")) {
    return Response.json({ error: "잘못된 요청입니다" }, { status: 415 });
  }
  const text = await req.text();
  if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) {
    return Response.json({ error: "요청이 너무 큽니다" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }
  const { name, phone, item, privacy, sms, company } = body as Record<string, unknown>;

  // honeypot: hidden field only bots fill in — pretend success, store nothing
  if (typeof company === "string" && company.trim() !== "") {
    return Response.json({ ok: true }, { status: 201 });
  }

  if (typeof name !== "string" || typeof phone !== "string" || typeof item !== "string" || typeof sms !== "boolean" || privacy !== true) {
    return Response.json({ error: "입력값을 확인해 주세요" }, { status: 400 });
  }
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const trimmedItem = item.trim();
  if (trimmedName.length < 1 || trimmedName.length > 30) return Response.json({ error: "이름을 확인해 주세요" }, { status: 400 });
  if (!PHONE_RE.test(trimmedPhone)) return Response.json({ error: "연락처를 확인해 주세요" }, { status: 400 });
  if (trimmedItem.length < 1 || trimmedItem.length > 60) return Response.json({ error: "상담 항목을 확인해 주세요" }, { status: 400 });

  if (storeMode() === "unconfigured") {
    return Response.json({ error: "준비 중" }, { status: 503 });
  }

  try {
    await createInquiry({ name: trimmedName, phone: trimmedPhone, item: trimmedItem, sms_consent: sms });
  } catch (err) {
    console.error("createInquiry failed", err);
    return Response.json({ error: "잠시 후 다시 시도해 주세요" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}

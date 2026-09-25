"use client";
import { useActionState } from "react";
import { login, type LoginState } from "../actions";

const initial: LoginState = { error: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <form action={formAction} className="ad-login-form">
      <label htmlFor="ad-password">비밀번호</label>
      <input id="ad-password" name="password" type="password" autoComplete="current-password" required />
      {state.error && <p className="ad-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "확인 중..." : "로그인"}</button>
    </form>
  );
}

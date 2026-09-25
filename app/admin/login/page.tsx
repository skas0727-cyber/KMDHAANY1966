import { redirect } from "next/navigation";
import { isAdmin } from "../auth";
import LoginForm from "./login-form";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="ad-login">
      <div className="ad-login-card">
        <h1>관리자 로그인</h1>
        <LoginForm />
      </div>
    </main>
  );
}

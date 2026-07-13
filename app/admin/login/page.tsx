import Link from "next/link";
import { LogIn } from "lucide-react";
import { signIn } from "@/app/admin/login/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorText =
    params.error === "config"
      ? "管理员密码环境变量未配置。"
      : params.error === "credentials"
        ? "管理员密码不正确。"
        : "";

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="admin-layout">
            <section className="admin-panel">
              <p className="eyebrow">Local Admin Login</p>
              <h1>后台登录</h1>
              <p className="summary">前台公开展示，后台用本地管理员密码保护。数据保存在当前浏览器。</p>
              {errorText ? <p className="notice">{errorText}</p> : null}
              <form action={signIn} className="form-grid">
                <div className="field full">
                  <label htmlFor="password">管理员密码</label>
                  <input id="password" name="password" type="password" autoComplete="current-password" required />
                </div>
                <div className="field full">
                  <button className="primary" type="submit">
                    <LogIn size={17} aria-hidden="true" />
                    登录后台
                  </button>
                </div>
              </form>
            </section>
            <aside className="admin-panel">
              <h2>说明</h2>
              <p>当前是单人本地模式，不再访问 Supabase，所以页面不会因为网络慢而卡住。</p>
              <Link className="button" href="/">
                返回首页
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

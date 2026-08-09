import { useState } from "react";
import Input from "./components/Input.jsx";

// 演示用的内联 SVG 图标
function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-zinc-700">{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [email, setEmail] = useState("");

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Unit 02 · Input 组件
      </h1>
      <p className="mb-10 text-zinc-500">
        学习 :focus 伪类、disabled 态、Flex slot 布局
      </p>

      {/* ---- 基础 input ---- */}
      <Section title="基础用法">
        <div className="space-y-4">
          <Input placeholder="请输入文本..." />
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Input type="number" placeholder="Number" />
        </div>
      </Section>

      {/* ---- 带图标 slot ---- */}
      <Section title="prefix / suffix 图标插槽（Flex 布局）">
        <div className="space-y-4">
          <Input prefix={<SearchIcon />} placeholder="搜索..." />
          <Input
            prefix={<MailIcon />}
            suffix={<span className="text-xs text-zinc-400">@qq.com</span>}
            placeholder="邮箱"
          />
          <Input prefix={<UserIcon />} placeholder="用户名" />
        </div>

      </Section>

      {/* ---- 禁用态 ---- */}
      <Section title="禁用态 (disabled)">
        <div className="space-y-4">
          <Input disabled placeholder="禁用状态" />
          <Input disabled prefix={<MailIcon />} value="disabled@example.com" />
        </div>
      </Section>

      {/* ---- 受控 input ---- */}
      <Section title="受控组件（React state）">
        <div className="space-y-3">
          <Input
            type="email"
            prefix={<MailIcon />}
            placeholder="请输入邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-sm text-zinc-400">当前值：{email || "（空）"}</p>
        </div>
      </Section>

      {/* ---- 文件上传 ---- */}
      <Section title="type=file">
        <Input type="file" />
      </Section>
    </main>
  );
}

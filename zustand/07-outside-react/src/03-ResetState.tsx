// 状态重置：将 store 恢复到初始状态
// 常见场景：用户退出登录、切换项目、清除搜索结果
import React from "react"
import { create } from "zustand"

interface Step {
  id: number
  label: string
  completed: boolean
}

interface WizardStore {
  steps: Step[]
  currentStep: number
  formData: { name: string; email: string }
  nextStep: () => void
  prevStep: () => void
  toggleStep: (id: number) => void
  setFormData: (data: Partial<WizardStore["formData"]>) => void
  // 重置：回到初始状态
  reset: () => void
}

// 将初始状态提取为常量——reset 时复用
const initialState = {
  steps: [
    { id: 1, label: "基本信息", completed: false },
    { id: 2, label: "选择方案", completed: false },
    { id: 3, label: "确认提交", completed: false },
  ],
  currentStep: 0,
  formData: { name: "", email: "" },
}

const useWizardStore = create<WizardStore>()((set) => ({
  ...initialState,
  nextStep: () =>
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, s.steps.length - 1),
    })),
  prevStep: () =>
    set((s) => ({
      currentStep: Math.max(s.currentStep - 1, 0),
    })),
  toggleStep: (id) =>
    set((s) => ({
      steps: s.steps.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step,
      ),
    })),
  setFormData: (data) =>
    set((s) => ({
      formData: { ...s.formData, ...data },
    })),
  // ✅ 重置：展开初始状态对象
  reset: () => set({ ...initialState }),
}))

export default function ResetState() {
  const steps = useWizardStore((s) => s.steps)
  const currentStep = useWizardStore((s) => s.currentStep)
  const formData = useWizardStore((s) => s.formData)
  const nextStep = useWizardStore((s) => s.nextStep)
  const prevStep = useWizardStore((s) => s.prevStep)
  const toggleStep = useWizardStore((s) => s.toggleStep)
  const setFormData = useWizardStore((s) => s.setFormData)
  const reset = useWizardStore((s) => s.reset)

  return (
    <div className="space-y-3">
      {/* 步骤条 */}
      <div className="flex items-center gap-1">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            {idx > 0 && (
              <span className="text-zinc-300 text-xs">→</span>
            )}
            <button
              onClick={() => toggleStep(step.id)}
              className={`rounded px-2 py-1 text-xs transition-colors ${
                idx === currentStep
                  ? "bg-blue-500 text-white"
                  : step.completed
                    ? "bg-green-100 text-green-600"
                    : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {step.label}{" "}
              {step.completed && <span>✓</span>}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* 当前步骤 */}
      <div className="rounded bg-zinc-50 p-3">
        <p className="text-sm font-medium text-zinc-700">
          第 {currentStep + 1} 步：
          {currentStep === 0 && "基本信息"}
          {currentStep === 1 && "选择方案"}
          {currentStep === 2 && "确认提交"}
        </p>
        {currentStep === 0 && (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="姓名"
              className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              placeholder="邮箱"
              className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
            />
          </div>
        )}
        {currentStep === 1 && (
          <p className="mt-2 text-sm text-zinc-500">选择你的方案（演示占位）</p>
        )}
        {currentStep === 2 && currentStep === 2 && (
          <div className="mt-2 text-sm text-zinc-600">
            <p>姓名：{formData.name || "（未填写）"}</p>
            <p>邮箱：{formData.email || "（未填写）"}</p>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="rounded bg-zinc-200 px-3 py-1 text-xs hover:bg-zinc-300 disabled:opacity-40"
          >
            上一步
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="rounded bg-zinc-200 px-3 py-1 text-xs hover:bg-zinc-300 disabled:opacity-40"
          >
            下一步
          </button>
        </div>
        <button
          onClick={reset}
          className="rounded bg-orange-100 px-3 py-1 text-xs text-orange-600 hover:bg-orange-200"
        >
          重置向导
        </button>
      </div>

      <p className="text-xs text-zinc-400">
        将初始状态提取为常量，reset 时直接展开即可——简洁且保证一致性
      </p>
    </div>
  )
}


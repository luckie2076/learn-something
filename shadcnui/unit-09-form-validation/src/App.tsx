import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// ① 用 zod 声明「数据长什么样、有什么约束」——这是单一事实来源
const formSchema = z.object({
  username: z
    .string()
    .min(2, "用户名至少 2 个字符")
    .max(20, "用户名最多 20 个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "只能含字母、数字和下划线"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少 8 位"),
})

// 从 schema 推导表单值的 TS 类型，避免手写两遍
type FormValues = z.infer<typeof formSchema>

export default function App() {
  // ② 用 react-hook-form 接管整个表单的 state 与校验
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // 把 zod 规则接进来
    defaultValues: { username: "", email: "", password: "" },
    mode: "onTouched", // 失焦后才开始校验，体验更友好
  })

  function onSubmit(values: FormValues) {
    // 走到这里说明 zod 已通过，values 一定是符合 schema 的干净数据
    alert("提交成功：\n" + JSON.stringify(values, null, 2))
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-sm space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">单元 09 · 表单校验</h1>
          <p className="text-sm text-muted-foreground">
            react-hook-form + zod
          </p>
        </header>

        {/* ③ 把整个 form 实例注入 <Form>，内部各 FormField 才能读到状态 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    2-20 个字符，仅限字母、数字、下划线。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>至少 8 位。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="inline-flex w-full h-9 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            >
              提交
            </button>
          </form>
        </Form>
      </div>
    </main>
  )
}

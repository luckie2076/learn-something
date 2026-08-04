# 单元 09 · 表单校验（react-hook-form + zod）

> 主题：用 zod 声明校验规则、用 react-hook-form 接管表单状态、用 shadcn `Form` 复合组件把二者优雅地接到 UI 上。

## 1. 现象

手写表单校验通常是这样的噩梦：

```tsx
const [username, setUsername] = useState("")
const [error, setError] = useState("")
function handleChange(e) {
  setUsername(e.target.value)
  if (e.target.value.length < 2) setError("太短")
  else setError("")
}
```

每多一个字段，就要复制一遍 state、校验、错误展示；字段多了，逻辑散落一地、类型还对不上。**本单元用三个库把这件事干干净净地拆开**——这正是现实项目里的标准做法。

最终成品（`src/App.tsx`）：一个登录表单，失焦即校验、错误就近展示、提交时拿到一份类型安全的干净数据。

## 2. 原理：三个角色各管一件事

| 角色 | 库 | 职责 |
|---|---|---|
| **规则** | `zod` | 声明「数据长什么样」：类型、长度、格式。单一事实来源 |
| **状态** | `react-hook-form`（RHF） | 接管每个字段的 value / 错误 /  touched 状态，性能优化（非受控） |
| **UI** | `shadcn Form` | 把 RHF 的状态自动接到 Label / Input / 错误文案上，并处理 a11y |

### ① zod：校验规则 = 单一事实来源

```tsx
const formSchema = z.object({
  username: z.string().min(2, "用户名至少 2 个字符").max(20, "最多 20 个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少 8 位"),
})
type FormValues = z.infer<typeof formSchema> // 自动推导 TS 类型
```

- `z.object({...})` 描述结构；每个字段用链式方法堆约束，第二个参数是校验失败的中文提示。
- `z.infer<typeof formSchema>` 让 **TS 类型和校验规则永不脱节**——改了规则，类型自动跟着变。

### ② react-hook-form：不靠 `useState` 存每个字段

```tsx
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),       // 把 zod 规则接进来做校验
  defaultValues: { username: "", email: "", password: "" },
  mode: "onTouched",                       // 失焦后才校验
})
```

关键点：**RHF 内部用 `ref` 而非 `value` 受控每个 input**，所以输入时不会触发整个表单 re-render（性能远好于一个个 `useState`）。`resolver` 是转接口——它让 RHF 在提交/校验时调用 zod 来判定对错。

提交时：

```tsx
<form onSubmit={form.handleSubmit(onSubmit)}>  {/* handleSubmit 会先跑 zod，通过才调 onSubmit */}
```

`onSubmit(values)` 收到的 `values` 已经经过 zod 验证，**一定是符合 schema 的干净对象**，直接发给后端即可。

### ③ shadcn Form：把状态「就近」铺到 UI

`Form` 组件（`src/components/ui/form.tsx`）本质是把 RHF 的 `Controller` + Context 包了一层：

- `<Form {...form}>` 用 `FormProvider` 把 `form` 实例注入 Context，所有子组件无需层层传 props。
- `<FormField name="username">` 内部用 `<Controller>` 把该字段的 `field`（value/onChange/ref）和 `fieldState`（error/touched）取出来。
- `useFormField()` 是一个自定义 Hook，自动算出每个字段的 `id`、错误、以及对应的 `aria-*` 关联 id——**这就是可访问性的关键**。

看源码里 `FormControl` 怎么用 `Slot`（呼应单元 03 的 asChild）：

```tsx
<Slot
  id={formItemId}
  aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
  aria-invalid={!!error}
  {...props}
/>
```

它把 `Input` 作为「子元素」套进来，同时自动注入 `id` 和 `aria-*`。于是：

- `<FormLabel>` 的 `htmlFor` 自动指向 Input 的 `id` → 点标签聚焦输入框；
- 出错时 `aria-invalid` + `aria-describedby` 指向错误文案 → 屏幕阅读器朗读「邮箱 无效：请输入有效的邮箱地址」。

**这正是 shadcn 的设计哲学**：外观（Tailwind）与行为（Radix / RHF）分离，而 a11y 不是事后补丁，而是内置在组件衔接里。

## 3. 代码：完整用法

`src/App.tsx` 已给出最小可跑版本。核心骨架：

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>邮箱</FormLabel>
          <FormControl><Input type="email" {...field} /></FormControl>
          <FormMessage />            {/* 自动显示该字段的错误文案 */}
        </FormItem>
      )}
    />
    <button type="submit">提交</button>
  </form>
</Form>
```

- `{...field}` 把 RHF 的 `value/onChange/onBlur/ref` 一股脑传给 `Input`，不多写一行。
- `<FormMessage />` 不用传参，它从 Context 自动知道当前字段有没有错、错在哪。
- 想加自定义校验提示？写进 `FormDescription` 即可（如密码「至少 8 位」）。

## 4. 为什么：这套组合解决了什么

1. **规则只写一遍**：zod schema 既是运行时校验，又是 TS 类型（`z.infer`）。少一处手写就少一处漂移。
2. **性能与受控解耦**：RHF 用非受控 `ref` 管理输入，长表单也不卡。
3. **错误信息就近、可访问**：`FormMessage` 跟着字段走，且自带 `aria-invalid` / `aria-describedby`，无需自己拼无障碍属性。
4. **关注点分离**：zod 管「对错」、RHF 管「状态」、Form 管「渲染」。三者可独立替换（例如换成 yup 校验、换成别的 UI 库）。

> 与单元 04（纯 Input/Label 手写）、单元 08（`defaultValue` 非受控 Select）对照看：表单越复杂，越需要 RHF + zod 这套「工业化」方案；简单场景直接用原生受控/非受控足够。

---

回到 [根 README](../../README.md) · 上一单元：[单元 08 · Select 选择器](../../unit-08-select)

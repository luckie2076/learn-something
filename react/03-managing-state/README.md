# 第三章 · 管理状态（Managing State）

> 对应官方文档：[Managing State](https://react.dev/learn/managing-state)
> 运行：`pnpm install && pnpm dev`。代码在 `src/App.jsx` 按小节聚合，每节一个文件。
>
> 上一章：[添加交互](../02-adding-interactivity/README.md)&nbsp;&nbsp;|&nbsp;&nbsp;下一章：[脱围机制](../04-escape-hatches/README.md)

---

## 1. 用 State 响应输入
**思维转变**：不要“命令式”去手动改 UI（如 `btn.disabled = true`），而是**描述组件在不同状态下长什么样**，由用户输入改变 state。UI 是 state 的纯函数：state 变了，界面自动跟着变。

```jsx
const [text, setText] = useState('')
<button disabled={text.trim() === ''}>提交</button>
```

## 2. 选择 State 结构
**原则**：state 里**不要存冗余、可由其他 state 推导的数据**。只存“源头”，派生值在渲染时计算。好处：少一份数据就少一个“忘记同步”的 bug。

> 反例：同时存 `firstName`、`lastName`、`fullName`。`fullName` 可由前两者拼出，忘了同步就前后矛盾。

## 3. 在组件间共享状态
**状态提升（Lifting State Up）**：当两个兄弟组件需要同步，把 state 移到「最近的公共父组件」，再用 props 下发。这样“唯一真相”只在父组件一处，子组件天然同步。

```jsx
// 父组件持有 celsius，两个子组件都从它读 / 写 —— 永远一致
<CelsiusInput value={celsius} onChange={setCelsius} />
<FahrenheitDisplay celsius={celsius} />
```

## 4. 对 State 进行保留和重置
**默认行为**：同一位置的同一组件，React 会**保留**它的 state（不重置）。

**强制重置**：给组件一个不同的 `key`，React 视其为全新实例，丢弃旧 state。

```jsx
<Chat key={who} recipient={who} />  // 切 who 即重置聊天草稿
```

**为什么有用**：切换标签页 / 收件人时清空输入框，正是这个机制。

## 5. 迁移状态逻辑至 Reducer
当事件处理要更新多个 state、或更新逻辑复杂时，用 `useReducer` 把“怎么变”收拢进一个 reducer 函数，事件只派发 action。更新逻辑集中、可测试、组件更清爽。

```jsx
const [count, dispatch] = useReducer(reducer, 0)
dispatch({ type: 'inc' })
```

## 6. 使用 Context 深层传递参数
props 逐层透传很烦（"prop drilling"）。`createContext` + `useContext` 让父组件把数据**广播**给任意深度的子组件，跳过中间传话筒。

```jsx
<ThemeContext.Provider value={theme}>
  <Toolbar />  {/* 深层直接 useContext(ThemeContext) 读取 */}
</ThemeContext.Provider>
```

**注意**：Context 解决的是“传递”，不是“状态本身”。状态通常还是用 `useState`/`useReducer` 持有。

## 7. 使用 Reducer 和 Context 拓展你的应用
把第 5、6 节组合：用 reducer 管理复杂状态，用 context 把「状态 + 派发」广播下去。任意深度的子组件都能**零 props 透传**地读写——应用规模变大也不乱。这是中大型应用的主流状态组织方式。

## 8. 复合组件 — Context 的设计模式应用
**复合组件模式**（Compound Components）是 Context 的经典应用：父组件持有状态并通过 Context 隐式广播，子组件自动接收。调用方只需**声明式地组合标签**，无需手动将 props 一层层往下传。

```jsx
<Tabs>
  <Tabs.TabList>
    <Tabs.Tab index={0}>标签一</Tabs.Tab>
  </Tabs.TabList>
  <Tabs.TabPanel index={0}>内容</Tabs.TabPanel>
</Tabs>
```

**核心机制**：`Tabs` 内部用 `createContext` + `Provider` 共享 `{ activeIndex, setActiveIndex }`，`Tab` 和 `TabPanel` 通过 `useContext` 读取，决定高亮和显隐。库级组件（如 Radix UI、Headless UI）普遍使用此模式。

**与第 6、7 节的关系**：第 6 节讲技术（Context 怎么用），第 7 节讲组合（Reducer + Context），本节讲**设计模式**——如何用 Context 构建出优雅的 API。

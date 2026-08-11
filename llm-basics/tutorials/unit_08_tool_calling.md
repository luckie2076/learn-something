# 08 · Tool Calling —— 让模型「调用外部工具」

> **角色**：让模型不仅能「说」，还能「做」。给模型提供工具定义（函数签名 + 描述），
> 模型在需要时输出 JSON 格式的函数调用，由外部代码执行后把结果喂回模型。

---

## 一句话理解

Tool Calling 的**核心秘密**：模型本身没有任何变化。它不加载插件、不改架构、不加模块。
你只是把**工具的使用说明写进了 Prompt**，模型在训练时学会了：当遇到需要外部信息的问题时，
输出一个 `<tool_call>{"name":"xxx","arguments":{...}}</tool_call>` 的 JSON 块。

---

## 核心概念

### 模型没有"调用"能力 —— 它只会「输出文本」

这是最重要的认知：

```
❌ 错误理解: 模型「调用」了一个函数
✅ 正确理解: 模型输出了一段 JSON 文本，你的 Python 代码识别了它，替你执行了函数
```

模型全程只做一件事：**根据输入预测下一个 token**。`get_weather("北京")` 这段代码
从未在模型内部运行过 —— 它只是输出了一串看起来像是函数调用的文字。

### 三步骤流程

```
┌─ 步骤 1: 嵌入工具定义 ──────────────────────────────────────┐
│ 把工具的 JSON Schema（名称、描述、参数）写入 System Prompt    │
│ 模型读完，知道「如果需要天气信息，就输出 get_weather JSON」   │
└──────────────────────────────────────────────────────────────┘
  │
  ▼
┌─ 步骤 2: 模型决策 ──────────────────────────────────────────┐
│ 用户: "北京天气怎么样？"                                     │
│ 模型输出: <tool_call>{"name":"get_weather","arguments":       │
│           {"city":"北京"}}</tool_call>                        │
│ 你的代码: 解析 JSON → 执行 get_weather("北京") → 得到结果     │
└──────────────────────────────────────────────────────────────┘
  │
  ▼
┌─ 步骤 3: 结果回喂 ──────────────────────────────────────────┐
│ 把工具执行结果追加到对话:                                    │
│   {"role":"tool","content":"晴天，25°C"}                      │
│ 模型基于结果生成最终回复: "北京今天晴天，气温 25°C"          │
└──────────────────────────────────────────────────────────────┘
```

### 工具定义长什么样（JSON Schema）

```python
weather_tool = define_tool(
    name="get_weather",
    description="获取指定城市的实时天气信息",
    parameters={
        "city": {"type": "string", "description": "城市名称，如 北京"}
    }
)

# 会被转化成如下 JSON Schema 嵌入到 Prompt：
# {
#   "type": "function",
#   "function": {
#     "name": "get_weather",
#     "description": "获取指定城市的实时天气信息",
#     "parameters": {
#       "type": "object",
#       "properties": {
#         "city": {"type": "string", "description": "城市名称，如 北京"}
#       },
#       "required": ["city"]
#     }
#   }
# }
```

### 模型如何「学会」工具调用

训练数据中包含了大量这样的示例：

```
用户: 北京天气怎么样？
助手: <tool_call>{"name":"get_weather","arguments":{"city":"北京"}}</tool_call>
```

模型通过海量训练学会了：**当问题需要实时信息时 → 输出 tool_call 格式 → 等待外部返回 → 基于返回组织回答**。

---

## 数据流

```
messages = [{"role": "user", "content": "北京天气怎么样？"}]
tools = [weather_tool, calc_tool, ...]
  │
  ▼
_pack_messages_with_tools(messages, tools)
  │ 把工具定义写入 System Prompt
  │ 打包为 token IDs
  ▼
u05.generate_ids(ids)
  │ 模型自回归生成
  ▼
模型输出文本（可能包含 <tool_call> 块）
  │
  ▼
_parse_tool_call(text)
  │ 正则提取 JSON
  ▼
tool_calls = [{"name": "get_weather", "arguments": {"city": "北京"}}]
  │
  ▼
execute_tool_call(tool_calls[0])
  │ 在 Python 端执行真实函数
  ▼
"晴天，25°C，湿度 40%"
  │
  ▼
追加 tool 角色消息 → 再次调用模型 → 最终回复
  "北京今天晴天，气温 25°C，湿度 40%，适合户外活动。"
```

---

## 为什么 Tool Calling 是工程技巧而非模型能力

| 环节 | 谁负责 | 说明 |
|------|--------|------|
| 工具定义 | 你的代码 | JSON Schema 写在 Prompt 里 |
| 决策是否调用 | 模型 | 训练时学到的模式匹配 |
| 生成调用参数 | 模型 | 同样是从训练里学会的 |
| 执行函数 | 你的代码 | `eval()` / API 请求 / 数据库查询 |
| 解析结果 | 你的代码 | 把返回值拼成文本 |
| 生成最终回复 | 模型 | 和普通对话一模一样 |

**模型只是「委托」你的代码去干活，它自己什么都没做。**

---

## 对外接口

| 函数 | 输入 | 输出 |
|------|------|------|
| `define_tool(name, description, params)` | 工具名 + 描述 + 参数定义 | 工具的 JSON Schema |
| `tool_chat(messages, tools, ...)` | 消息 + 工具定义 | (回复文本, tool_calls 或 None) |
| `execute_tool_call(tool_call)` | tool_call 字典 | 执行结果字符串 |
| `tool_call_round(messages, tools, ...)` | 消息 + 工具定义 | 最终回复（自动执行工具） |

---

## 演示输出

运行 `uv run unit_08_tool_calling.py`，你会看到：

```
演示 1: 问天气 → 模型调用工具
  模型原始输出: <tool_call>{"name": "get_weather", "arguments": {"city": "北京"}}</tool_call>
  tool_calls: [{"name": "get_weather", "arguments": {"city": "北京"}}]
  执行 get_weather({'city': '北京'}) → 晴天，25°C，湿度 40%
  最终回复: 北京今天晴天，温度25°C，湿度40%。

演示 2: 寒暄 → 不调用工具
  回复: 你好！我是AI助手...
  tool_calls: None

演示 3: 计算 → 调用 calculator
  最终回复: 123 * 456 = 56088
```

> **要点**：Tool Calling 不是新模型——只是把工具描述嵌入 System Prompt。模型被训练学会在需要时输出 `<tool_call>` JSON 块，函数的实际执行在 Python 端完成。

## 运行方式

```bash
cd llm-basics
uv run unit_08_tool_calling.py
```

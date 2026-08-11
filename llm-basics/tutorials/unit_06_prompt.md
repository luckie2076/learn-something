# 06 · Prompt —— Chat Template 与 System Prompt

> **角色**：让模型能"听懂指令"。把消息列表（含角色标记）打包成模型认识的格式，
> 并添加 System Prompt 来控制回答风格。

---

## 一句话理解

模型本身**不区分角色**（它无所谓谁是 user、谁是 assistant），它只会续写文本。
本单元通过 **Chat Template** 把 `system/user/assistant` 这些元信息镶嵌成特定格式的文字，
让模型"学会"按角色行事。

---

## 核心概念

### Chat Template —— 模型约定的对话格式

模型在训练时见过某种固定格式的对话。推理时你必须用**同样的格式**包装输入，
模型才能正确地续写。不同模型的 Chat Template 可能不同。

```python
# 输入：消息列表
messages = [
    {"role": "system", "content": "你是简短的助手"}
    {"role": "user", "content": "什么是机器学习？"},
]

# 经过 Chat Template 格式化后的文本（Qwen 的格式）：
"""
<|im_start|>system
你是简短的助手<|im_end|>
<|im_start|>user
什么是机器学习？<|im_end|>
<|im_start|>assistant
"""
```

模型看到这些标记后，就知道：`<|im_start|>assistant` 后面该生成回复了。

### System Prompt —— 最前面的"隐形指令"

System Prompt 放在对话最开头，告诉模型**它是什么角色、该怎么回答**。它不直接出现在回复中，
但影响整个回答的风格和边界。

```
带 System Prompt:    回答控制在 15 字以内，精炼简洁
不带 System Prompt:  回答可能很长、随意发挥
```

### 多轮对话 = 不断追加消息

模型本身没有"记忆"——多轮对话的"记忆"是这样实现的：

```python
messages = [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "第一轮问题"},
    {"role": "assistant", "content": "第一轮回答"},
    {"role": "user", "content": "第二轮问题"},      # ← 追加
    {"role": "assistant", "content": "第二轮回答"},  # ← 追加
    {"role": "user", "content": "第三轮问题"},      # ← 又追加
]
```

每轮都把 **完整历史** 重新打包送进模型。模型看到前面的对话，就能"记住"上下文。

---

## 数据流

```
messages = [
    {"role": "system", "content": "你是一个简短的助手"},
    {"role": "user", "content": "什么是机器学习？"},
]
  │
  ▼
format_chat(messages)
  │ 应用 Chat Template
  │ 添加 generation prompt（<|im_start|>assistant\n）
  ▼
格式化文本 + token IDs
  │
  ▼
u05.generate_ids(ids, ...)     ← 自回归生成
  │
  ▼
u01.decode(new_ids)             ← 还原为文本
  │
  ▼
"机器学习是让计算机从数据中学习规律的技术。"
```

---

## Chat Template 到底往文本里塞了什么？

以 Qwen 的格式为例（不同模型格式不同，但原理相同）：

```
带 System Prompt 的打包结果:
<|im_start|>system
你是一个简短的助手，回答不超过 15 个字。<|im_end|>
<|im_start|>user
什么是机器学习？<|im_end|>
<|im_start|>assistant
                                          ← 模型从这里开始续写
```

**关键点**：`add_generation_prompt=True` 会自动在末尾加上 `<|im_start|>assistant\n`，
告诉模型"轮到 assistant 说话了"。这样模型就知道该开始生成回复而不是继续写 user 的内容。

---

## 对外接口

| 函数 | 输入 | 输出 |
|------|------|------|
| `format_chat(messages)` | 消息列表 | `(格式化文本, token IDs)` |
| `chat(messages, ...)` | 消息列表 + 参数 | 回复文本 str |

`chat()` 内部串了三条链路：`format_chat → u05.generate_ids → u01.decode`

---

## 演示输出

运行 `uv run unit_06_prompt.py`，你会看到：

```
format_chat() → 打包后的文本（模型实际看到的）:
  <|im_start|>system
  你是一个简短的助手，回答不超过 15 个字。<|im_end|>
  <|im_start|>user
  什么是机器学习？<|im_end|>
  <|im_start|>assistant
  → 35 个 token IDs

chat() → 回复:
  带 System Prompt: 机器学习是让计算机从数据中学习。
  无 System Prompt: 机器学习是人工智能的一个分支......
```

> **要点**：chat() 内部串联 format_chat → u05.generate → u01.decode。System Prompt 是最前面的"隐形指令"，控制回答风格。

## 运行方式

```bash
cd llm-basics
uv run unit_06_prompt.py
```

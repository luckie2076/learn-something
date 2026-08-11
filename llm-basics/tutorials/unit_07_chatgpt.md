# 07 · Minimal ChatGPT —— 多轮对话 CLI（全课程总装）

> **角色**：把前面 6 个黑盒串成可交互的聊天终端。维护消息历史，实现多轮上下文记忆。

---

## 一句话理解

u06 只管一次问答（消息 → 回复）。本单元把**多次问答**串起来：读取用户输入 → 追加到消息列表 → 调用 u06.chat → 显示回复 → 把 AI 回复也追加进列表 → 循环。本质就是维护一个不断变长的 `messages` 列表。

---

## 多轮对话的实现

```python
messages = [
    {"role": "system", "content": "你是简短的助手"},
]

# 第一轮
user: "你好"
messages.append({"role": "user", "content": "你好"})
reply = u06.chat(messages)  # → "你好！有什么可以帮助你的？"
messages.append({"role": "assistant", "content": reply})

# 第二轮（model 能看到第一轮的全部内容）
user: "我刚才说了什么？"
messages.append({"role": "user", "content": "我刚才说了什么？"})
reply = u06.chat(messages)  # → "你刚才说了「你好」"
# ↑ 能答对，因为 messages 里包含完整历史！
```

模型**没有内置的对话记忆**。它之所以能"记住"，纯粹是因为**每次调用时把整个对话历史都塞给它了**。这就是 messages 列表不断变长的原因。

---

## 全链路串联

当你在终端输入一句话，7 个黑盒在背后依次运作：

```
你在终端输入: "什么是机器学习？"
  │
  ▼
[u01 Tokenization]     "什么是机器学习？" → token IDs
[u02 Embeddings]       token IDs → 向量矩阵 [n, 896]
[u03 Attention ×24]    向量融合上下文（每层都做）
[u04 Transformer]      向量 → logits → 对下一个 token 打分
[u05 Generation]       循环：选词 → 拼回 → 再打分 → 直到终止
[u06 Prompt]           Chat Template 格式化 + System Prompt
[u07 ChatGPT]          维护 messages 列表，多轮循环
  │
  ▼
终端显示: "机器学习是让计算机从数据中学习规律的技术。"
```

全部自动完成，对你来说只是"输入一句话，得到一句回复"。

---

## 代码结构

```python
def run_chat(system_prompt):
    messages = [{"role": "system", "content": system_prompt}]
    
    while True:
        user_input = input("你: ")          # 读用户输入
        messages.append({"role": "user", ...})  # 追加 user 消息
        reply = u06.chat(messages)              # 调用完整链路
        print(f"AI: {reply}")
        messages.append({"role": "assistant", ...})  # 追加 AI 回复
```

每个单元之间完全解耦，u07 只依赖 u06 的 `chat` 接口。

---

## 记忆的代价

把完整历史每次都塞给模型有一个**成本问题**：

- 第 1 轮：处理 20 个 token
- 第 10 轮：处理 500+ 个 token（包含前面 9 轮的完整对话）
- 第 50 轮：处理 5000+ 个 token

对话越长，每次调用消耗的计算量越大。这是所有 LLM 的固有限制。

---

## 对外接口

| 函数 | 输入 | 输出 |
|------|------|------|
| `run_chat(system_prompt)` | System Prompt 文本 | 交互式终端循环 |

---

## 演示输出

运行 `uv run unit_07_chatgpt.py`，你会看到交互式终端：

```
极简 ChatGPT（Qwen/Qwen3-0.6B，纯 CPU）| 输入 quit 退出
--------------------------------------------------

你: 你好
AI: 你好！有什么可以帮助你的？

你: 什么是Python？
AI: Python是一种高级编程语言...

你: quit
再见！
```

## 运行方式

```bash
cd llm-basics
uv run unit_07_chatgpt.py
```

输入 `quit` 退出。

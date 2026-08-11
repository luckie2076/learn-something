# 09 · Thinking Mode —— 训练时内建的「先思考，后回答」

> **角色**：Qwen3 在训练时就学会了「先推理再回答」，不是推理时 Prompt 工程的补丁。
> 专用 token（`<|endofthink|>` `<|begin_of_suffix|>` 等）的语义在预训练/SFT 阶段就已写入模型权重。

---

## 核心认知纠正

**常见误解** ❌：Thinking Mode = 推理时在 Prompt 里加「请先思考」
**实际情况** ✅：模型训练数据中包含了海量「`<|begin_of_thought|>` 推理…… `<|end_of_thought|>` 答案」的样本，模型在训练时就把这些专用 token 的语义学到了权重里。推理时只是触发它。

---

## 训练阶段发生了什么

以 Qwen3 为例，训练数据中包含了这样的样本：

```
输入（经过 chat template 编码后）:
<|im_start|>user
3 个人 3 天喝 3 桶水，9 个人 9 天喝几桶水？<|im_end|>
<|im_start|>assistant
<|begin_of_thought|>
已知：3 人 3 天 3 桶
→ 单人单天: 3÷3÷3 = 1/3 桶
→ 9 人 9 天: 1/3 × 9 × 9 = 27 桶
确认单位一致，计算正确。
<|end_of_thought|>
<|begin_of_suffix|>
答案是 27 桶水。
<|im_end|>
```

模型通过反向传播学会了：
- 看到 `<|begin_of_thought|>` → 接下来的 token 应该是推理步骤
- 输出完推理后 → 应输出 `<|end_of_thought|>` 然后切换为正式回答
- 这些 token 的概率分布模式的 **已经内化在模型权重中**

---

## 推理时只需要「触发」

```
tokenizer.apply_chat_template(messages, enable_thinking=True)
  │
  │  分词器在 prompt 末尾插入 <|begin_of_thought|>
  │  （不是改模型，只是触发训练时学会的行为模式）
  ▼
[token IDs 末尾多了 <|begin_of_thought|> 对应的 ID]
  │
  │  模型自回归生成
  ▼
模型看到 <|begin_of_thought|> → 自动输出推理链（因为训练时就是这样学的）
  → 推理完输出 <|end_of_thought|>
  → 然后输出 <|begin_of_suffix|> + 最终答案
```

**你不需要告诉模型「怎么思考」——模型在训练中已经学会了。你只需要说「现在开始思考」。**

---

## 两种方式对比

| | 原生思考模式 | Prompt 工程模拟 |
|---|---|---|
| 原理 | 专用 token 触发训练时习得的行为 | 用自然语言指令要求模型思考 |
| 可靠性 | 高（训练数据里有大量同类样本） | 中低（模型不一定会严格遵循） |
| token 开销 | 思考过程本身会消耗 token | 思考过程也会消耗 token |
| 模型要求 | 模型必须训练过思考模式 | 任何模型都行 |
| 代码写法 | `enable_thinking=True` | 在 System Prompt 里写指令 |

---

## 为什么小模型效果不完美

0.6B 参数的模型虽然训练时见过思考样本，但参数量不足以完美复现复杂推理。
更大的模型（DeepSeek-R1 671B、Qwen3-235B）的思考质量显著更高——
这恰恰说明思考能力是**训练时写进权重的**（模型越大，编码的推理能力越强），
而不是推理时 Prompt 技巧带来的。

---

## 数据流

```
messages = [{"role": "user", "content": "3人3天3桶，9人9天？"}]
  │
  ▼
tokenizer.apply_chat_template(messages, enable_thinking=True)
  │ chat_template 自动插入 <|begin_of_thought|> 在 assistant 标记后
  ▼
token IDs: [..., <|im_start|>assistant\n, <|begin_of_thought|>\n]
  │
  ▼
模型自回归生成
  │ （模型看到 <|begin_of_thought|>，因训练时的学习，开始输出推理链）
  ▼
输出: "已知：3人3天3桶\n→ 单人单天: ... \n<|end_of_thought|>\n<|begin_of_suffix|>\n27桶"
  │
  ▼
_split_by_tokens() 用专用 token 分隔
  │
  ▼
thinking = "已知：3人3天3桶\n→ 单人单天: ..."
response = "27桶"
```

---

## 对外接口

| 函数 | 输入 | 输出 | 说明 |
|------|------|------|------|
| `chat_thinking_on(messages)` | 消息列表 | (思考过程, 最终回答) | 默认模式，模型自然输出推理链 |
| `chat_thinking_off(messages)` | 消息列表 | 回复文本 | 关闭思考，直接给出答案 |
| `prompt_diff(messages)` | 消息列表 | 三种模式 prompt 对比 | 直观看到差异只在 prompt 末尾 |

---

## 演示输出

运行 `uv run unit_09_thinking.py`，你会看到：

**Part 1** 展示了三种模式的 prompt 文本差异：`enable_thinking=False` 在末尾注入了 `<think>\n\n</think>` 来抑制思考，而 `default` 和 `enable_thinking=True` 的 prompt 完全相同（都是空），模型自然按训练习惯输出推理链。

**Part 2** 展示了实际生成效果：
- 思考关闭时直接给答案（可能错误）
- 思考开启时先输出推理链再给答案

> **要点**：模型本身完全没变。所有差异都在 prompt 末尾——`enable_thinking=False` 注入 `<think>\n\n</think>` 来"模拟思考已完成"，模型跳过推理直接输出。

## 运行方式

```bash
cd llm-basics
uv run unit_09_thinking.py
```

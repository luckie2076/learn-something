# 大语言模型实现原理 (LLM Basics)

> **学习方法：黑盒学习法。** 每个单元都是一个黑盒——只需知道它的**作用**、**输入**、**输出**，
> 无需理解内部实现机制。沿数据流「文本 → token → 向量 → 注意力 → Transformer → 生成 → 对话 → 工具调用 → 思考模式」
> 把 9 个黑盒串联起来，最终组装出一个极简 ChatGPT。

## 运行方式

```bash
cd llm-basics
uv sync                              # 安装依赖（仅首次）
uv run unit_01_tokenization.py       # 每个单元都可独立运行
```

每个 `.py` 文件既可**独立运行**（`uv run unit_XX_xxx.py`），也可被后续单元 **import 调用**。

## 黑盒总览

```
用户输入文本
  │
  ▼
┌─ u01 Tokenization ─────────────────────────────┐
│ 作用: 模型的读写接口（模型只认识数字）           │
│ 输入: 文本          输出: token IDs              │
└─────────────────────────────────────────────────┘
  │ encode()
  ▼
┌─ u02 Embeddings ───────────────────────────────┐
│ 作用: token → 向量（语义相近 ⇒ 向量相近）        │
│ 输入: 文本/IDs      输出: 向量矩阵（无上下文）   │
└─────────────────────────────────────────────────┘
  │
  ▼
┌─ u03 Attention ────────────────────────────────┐
│ 作用: 让 token 吸收上下文信息                   │
│ 输入: 向量矩阵      输出: 同形状向量矩阵         │
│      （带上下文，可堆叠）                        │
└─────────────────────────────────────────────────┘
  │
  ▼
┌─ u04 Transformer ──────────────────────────────┐
│ 作用: u02 + N×u03 组装的完整模型                │
│ 输入: token IDs     输出: 词表上每个 token 的打分│
└─────────────────────────────────────────────────┘
  │ forward()
  ▼
┌─ u05 Generation ───────────────────────────────┐
│ 作用: 生成文本（自回归，内部循环无需关心）       │
│ 输入: IDs + 采样旋钮  输出: 新生成的 IDs         │
│ 旋钮: temperature / top_k / top_p               │
└─────────────────────────────────────────────────┘
  │ generate_ids()
  ▼
┌─ u06 Prompt ───────────────────────────────────┐
│ 作用: 消息打包（Chat Template）+ System Prompt  │
│ 输入: 消息列表      输出: 回复文本               │
└─────────────────────────────────────────────────┘
  │ chat()
  ▼
┌─ u07 ChatGPT ──────────────────────────────────┐
│ 多轮对话 CLI：把回复追加进消息列表，循环调用 u06 │
└─────────────────────────────────────────────────┘
  │
  ▼
┌─ u08 Tool Calling ─────────────────────────────┐
│ 作用: 模型输出 JSON 函数调用，由外部代码执行    │
│ 输入: 消息 + 工具定义    输出: 回复或 tool_call │
└─────────────────────────────────────────────────┘
  │
  ▼
┌─ u09 Thinking Mode ────────────────────────────┐
│ 作用: 训练时内建的「先推理再回答」能力（CoT）   │
│ 输入: 消息列表           输出: (思考过程, 回答)  │
│ 核心: enable_thinking=True 触发训练时学会的行为  │
└─────────────────────────────────────────────────┘
```

## 各单元速查

| 单元 | 作用（一句话） | 输入 → 输出 | 对外接口 |
|------|---------------|-------------|----------|
| 01 | 文本 ⇄ token IDs，模型唯一的读写接口 | 文本 ⇄ ID 列表 | `encode()` `decode()` `decode_each()` |
| 02 | token → 向量，语义可计算 | 文本 → 向量矩阵 | `get_model()` `token_embeddings()` `text_embedding()` `similarity()` |
| 03 | 向量吸收上下文，形状不变可堆叠 | 向量矩阵 → 同形状向量矩阵 | `attend()` |
| 04 | 完整模型：一次前向给「下一个 token」打分 | 文本 → top-k 候选 | `get_model_and_tokenizer()` `forward()` `predict_next()` |
| 05 | 生成文本，旋钮调风格 | prompt + 旋钮 → 续写文本 | `generate_ids()` `generate()` |
| 06 | 消息列表 → 回复，System Prompt 控风格 | 消息列表 → 回复文本 | `format_chat()` `chat()` |
| 07 | 多轮对话 CLI，全课程总装 | 你的输入 → AI 回复 | `run_chat()` |
| 08 | 模型输出 JSON → 外部执行 → 回喂结果 | 消息+工具定义 → 回复或 tool_call | `tool_chat()` `tool_call_round()` |
| 09 | 训练时内建的「先推理再回答」能力 | 消息列表 → (思考过程, 最终回答) | `chat_thinking_on()` `chat_thinking_off()` |

## 串联关系（import 链）

```
u01 ──→ u02 ──→ u03
 ╰────→  ╰────→ u04 ──→ u05 ──→ u06 ──→ u07
                                        ╰──→ u08 ──→ u09
```

每个后续单元只调用前置单元的**对外接口**，不碰内部实现——这正是黑盒学习法在代码上的体现。

u08 和 u09 都复用 u01（分词器）+ u05（生成能力），但它们的核心价值在于：
- **u08 是 Prompt 工程 + 输出解析**：把工具定义写进 Prompt，解析 JSON 输出
- **u09 是训练时内建的能力**：enable_thinking=True 触发模型训练时学会的推理行为

全课程统一使用同一个模型 `Qwen/Qwen3-0.6B`（约 1GB，纯 CPU 可跑），
分词器与模型始终配套，避免「换模型」造成的认知干扰。

## 详细教程

每个单元配有独立教程，深入讲解概念原理、数据流和示例：

| 单元 | 教程 |
|------|------|
| 01 Tokenization | [文本 ⇄ token IDs](./tutorials/unit_01_tokenization.md) |
| 02 Embeddings | [token IDs → 向量矩阵](./tutorials/unit_02_embeddings.md) |
| 03 Attention | [让 token 之间交换信息](./tutorials/unit_03_attention.md) |
| 04 Transformer | [完整模型：对"下一个 token"打分](./tutorials/unit_04_transformer.md) |
| 05 Generation | [自回归生成 + 采样旋钮](./tutorials/unit_05_generation.md) |
| 06 Prompt | [Chat Template + System Prompt](./tutorials/unit_06_prompt.md) |
| 07 ChatGPT | [多轮对话 CLI 总装](./tutorials/unit_07_chatgpt.md) |
| 08 Tool Calling | [让模型调用外部工具](./tutorials/unit_08_tool_calling.md) |
| 09 Thinking Mode | [Chain-of-Thought 推理](./tutorials/unit_09_thinking.md) |

## 注意事项

- **首次运行**会自动下载模型（约 1GB），之后走本地缓存、离线可用
- 所有演示均在 **CPU** 上运行，无需 GPU
- 0.5B 小模型仅用于演示原理，回答质量有限属正常现象

### 国内网络加速

```bash
export HF_ENDPOINT=https://hf-mirror.com
uv run unit_01_tokenization.py
```

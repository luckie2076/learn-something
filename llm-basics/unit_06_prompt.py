"""
06-Prompt：Chat Template 与 System Prompt（让模型「听懂指令」）

对外接口：
  format_chat(messages) - 消息列表 → token IDs
  chat(messages, ...)   - 消息列表 → 回复文本

详细教程: tutorials/unit_06_prompt.md
"""
import unit_01_tokenization as u01
import unit_05_generation as u05


def format_chat(messages: list[dict]) -> list[int]:
    """消息列表 → token IDs（含 Chat Template + generation prompt）"""
    tokenizer = u01.get_tokenizer()
    ids = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True)
    if hasattr(ids, "keys"):
        ids = ids["input_ids"]
    ids = list(ids)
    if ids and isinstance(ids[0], list):
        ids = ids[0]
    return ids


def chat(
    messages: list[dict],
    max_new_tokens: int = 100,
    temperature: float = 0.7,
    top_p: float = 0.9,
    seed: int | None = None,
) -> str:
    """消息列表 → 回复文本"""
    ids = format_chat(messages)
    new_ids = u05.generate_ids(ids, max_new_tokens=max_new_tokens,
                               temperature=temperature, top_p=top_p, seed=seed)
    return u01.decode(new_ids, skip_special_tokens=False).strip()


# ---- 演示 ----
def demo():
    msgs_sys = [
        {"role": "system", "content": "你是一个简短的助手，回答不超过 15 个字。"},
        {"role": "user", "content": "什么是机器学习？"},
    ]
    msgs_plain = [{"role": "user", "content": "什么是机器学习？"}]

    # format_chat: 展示打包后的文本
    print("format_chat() → 打包后的文本（模型实际看到的）:")
    ids = format_chat(msgs_sys)
    print("  " + u01.decode(ids).replace("\n", "\n  "))
    print(f"  → {len(ids)} 个 token IDs")

    # chat: 展示带/不带 system prompt 的回复
    print(f"\nchat() → 回复:")
    print(f"  带 System Prompt: {chat(msgs_sys, max_new_tokens=1024, seed=42)}")
    print(f"  无 System Prompt: {chat(msgs_plain, max_new_tokens=1024, seed=42)}")


if __name__ == "__main__":
    demo()

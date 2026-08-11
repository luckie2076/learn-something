"""
09-Thinking Mode：模型训练时就内建的「先思考，后回答」能力

对外接口：
  chat_thinking_on(messages, ...)   - 思考模式（模型自然输出 <think>推理...</think>答案）
  chat_thinking_off(messages, ...)  - 关闭思考（直接输出答案）
  show_prompt(messages, mode)       - 展示模型实际读到的 prompt 文本
  prompt_diff(messages)             - 对比不同模式下的 prompt 差异

详细教程: tutorials/unit_09_thinking.md
"""
import re
import unit_01_tokenization as u01
import unit_05_generation as u05


# ---- 打包 token IDs ----
def _pack_ids(messages: list[dict], enable_thinking: bool | None = None) -> list[int]:
    """统一打包入口。enable_thinking=None（默认）= 思考模式开。"""
    tokenizer = u01.get_tokenizer()
    kwargs = {"tokenize": True, "add_generation_prompt": True}
    if enable_thinking is not None:
        kwargs["enable_thinking"] = enable_thinking

    raw = tokenizer.apply_chat_template(messages, **kwargs)
    ids = raw["input_ids"]
    ids = list(ids)
    if ids and isinstance(ids[0], list):
        ids = ids[0]
    return ids


# ---- 展示 Prompt 差异 ----
def show_prompt(messages: list[dict], enable_thinking: bool | None = None) -> str:
    """把组装好的 token IDs 还原为文本"""
    ids = _pack_ids(messages, enable_thinking)
    return u01.decode(ids, skip_special_tokens=False)


def prompt_diff(messages: list[dict]):
    """对比不同模式的 prompt 差异"""
    modes = {
        "default（思考开）": None,
        "enable_thinking=False（思考关）": False,
        "enable_thinking=True（显式思考开）": True,
    }

    for label, param in modes.items():
        ids = _pack_ids(messages, param)
        text = u01.decode(ids, skip_special_tokens=False)
        print(f"--- {label} ---")
        print(repr(text))
        print()

    # 末尾差异
    ids_on = _pack_ids(messages, None)
    ids_off = _pack_ids(messages, False)
    text_on = u01.decode(ids_on, skip_special_tokens=False)
    text_off = u01.decode(ids_off, skip_special_tokens=False)

    print("--- 关键对比：default vs enable_thinking=False ---")
    diff = text_off[len(text_on):]
    highlighted = text_on + "▶" + diff + "◀"
    print(f"  {repr(highlighted)}")


# ---- 解析模型输出 ----
def _parse_thinking(text: str) -> tuple[str, str]:
    """从模型输出中分离「思考过程」和「最终回答」"""
    m = re.search(r'<think>\s*(.*?)\s*</think>', text, re.DOTALL)
    if m:
        thinking = m.group(1).strip()
        after = text[m.end():].strip()
        return thinking, after
    return "", text


# ---- 对外接口 ----
def chat_thinking_on(
    messages: list[dict],
    max_new_tokens: int = 512,
    temperature: float = 0.7,
    seed: int | None = 42,
) -> tuple[str, str]:
    """思考模式（默认）：模型自然输出 <think>推理...</think>答案"""
    ids = _pack_ids(messages, enable_thinking=None)
    new_ids = u05.generate_ids(ids, max_new_tokens=max_new_tokens,
                               temperature=temperature, seed=seed)
    raw = u01.decode(new_ids, skip_special_tokens=False).strip()
    return _parse_thinking(raw)


def chat_thinking_off(
    messages: list[dict],
    max_new_tokens: int = 256,
    temperature: float = 0.7,
    seed: int | None = 42,
) -> str:
    """关闭思考：在 prompt 末尾注入 <think>\n\n</think> 抑制思考"""
    ids = _pack_ids(messages, enable_thinking=False)
    new_ids = u05.generate_ids(ids, max_new_tokens=max_new_tokens,
                               temperature=temperature, seed=seed)
    raw = u01.decode(new_ids, skip_special_tokens=False).strip()
    t, r = _parse_thinking(raw)
    return r if r else raw


# ---- 演示 ----
def demo():
    q = "3 个人 3 天喝 3 桶水，9 个人 9 天喝几桶水？"
    msgs = [{"role": "user", "content": q}]

    print("=" * 55)
    print("Part 1 · Prompt 文本对比（模型实际看到的）")
    print("=" * 55)
    prompt_diff(msgs)

    print(f"\n{'=' * 55}")
    print("Part 2 · 实际生成效果对比")
    print(f"问题: {q}")
    print(f"{'=' * 55}")

    # 思考关
    print(f"\n--- enable_thinking=False（思考关）---")
    prompt_off = show_prompt(msgs, enable_thinking=False)
    # 只展示末尾差异部分
    suffix = "\n".join(prompt_off.split("\n")[-5:])
    print(f"  发给模型的 prompt 末尾:\n  " + "\n  ".join(suffix.split("\n")))
    raw_off = chat_thinking_off(msgs, seed=42)
    print(f"\n  模型输出: {raw_off[:200]}...")

    # 思考开
    print(f"\n--- default / enable_thinking=True（思考开）---")
    prompt_on = show_prompt(msgs, enable_thinking=None)
    suffix = "\n".join(prompt_on.split("\n")[-5:])
    print(f"  发给模型的 prompt 末尾:\n  " + "\n  ".join(suffix.split("\n")))
    t, r = chat_thinking_on(msgs, seed=42)
    print(f"\n  [思考过程] ({len(t)} 字符)")
    print(f"  {t[:300]}{'...' if len(t) > 300 else ''}")
    print(f"\n  [最终答案] {r[:150]}")


if __name__ == "__main__":
    demo()

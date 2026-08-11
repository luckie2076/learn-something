"""
05-Generation：自回归生成（LLM「说话」的方式）

对外接口：
  generate_ids(ids, ...) - token IDs → 新增的 token IDs
  generate(prompt, ...)  - 文本 → (完整文本, 新增 IDs)

详细教程: tutorials/unit_05_generation.md
"""
import torch

import unit_01_tokenization as u01
import unit_04_transformer as u04


def generate_ids(
    input_ids: list[int],
    max_new_tokens: int = 30,
    do_sample: bool = True,
    temperature: float = 1.0,
    top_k: int = 50,
    top_p: float = 1.0,
    seed: int | None = None,
) -> list[int]:
    """token IDs → 新增的 token IDs"""
    model, tokenizer = u04.get_model_and_tokenizer()
    if seed is not None:
        torch.manual_seed(seed)
    kwargs = dict(max_new_tokens=max_new_tokens, do_sample=do_sample,
                  pad_token_id=tokenizer.eos_token_id)
    if do_sample:
        kwargs.update(temperature=temperature, top_k=top_k, top_p=top_p)
    with torch.no_grad():
        out = model.generate(torch.tensor([input_ids]), **kwargs)
    return out[0, len(input_ids):].tolist()


def generate(prompt: str, **kwargs) -> tuple[str, list[int]]:
    """文本 → (完整文本, 新增 IDs)"""
    ids = u01.encode(prompt)
    new_ids = generate_ids(ids, **kwargs)
    return prompt + u01.decode(new_ids), new_ids


# ---- 演示 ----
def demo():
    prompt = "人工智能的未来是"

    print(f"prompt: 「{prompt}」")
    print(f"  u01.encode → token IDs: {u01.encode(prompt)}")

    print(f"\n采样旋钮效果:")
    print(f"  do_sample=False（贪心）: {generate(prompt, max_new_tokens=15, do_sample=False)[0]}")
    for t in (0.3, 1.5):
        print(f"  temperature={t}:        {generate(prompt, max_new_tokens=15, temperature=t, seed=42)[0]}")
    print(f"  top_k=50,top_p=0.95:    {generate(prompt, max_new_tokens=15, temperature=0.8, top_k=50, top_p=0.95, seed=42)[0]}")


if __name__ == "__main__":
    demo()

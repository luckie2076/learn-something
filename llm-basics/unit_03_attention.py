"""
03-Attention：让 token 之间「交换信息」

对外接口：
  attend(text) - 文本 → (tokens, 输入向量, 输出向量)

详细教程: tutorials/unit_03_attention.md
"""
import torch
import torch.nn.functional as F

import unit_01_tokenization as u01
import unit_02_embeddings as u02


def attend(text: str) -> tuple[list[str], torch.Tensor, torch.Tensor]:
    """
    文本 → (tokens, 输入向量, 输出向量)
    输出形状与输入相同，但每个 token 的向量已吸收上下文。
    （随机权重仅演示机制，真实模型权重由训练得到）
    """
    ids, x = u02.token_embeddings(text)
    hidden_dim = x.size(-1)
    g = torch.Generator().manual_seed(42)
    w_q, w_k, w_v = (torch.randn(hidden_dim, hidden_dim, generator=g, dtype=x.dtype)
                     for _ in range(3))
    out = F.scaled_dot_product_attention(x @ w_q, x @ w_k, x @ w_v, is_causal=True)
    return u01.decode_each(ids), x, out


def _find_char(tokens: list[str], ch: str) -> int:
    return next(i for i, t in enumerate(tokens) if ch in t)


# ---- 演示 ----
def demo():
    s1, s2 = "小猫", "黑猫"
    toks1, x1, o1 = attend(s1)
    toks2, x2, o2 = attend(s2)
    i1, i2 = _find_char(toks1, "猫"), _find_char(toks2, "猫")

    print(f"句子「{s1}」tokens: {toks1}")
    print(f"句子「{s2}」tokens: {toks2}")
    print(f"向量形状: {list(x1.shape)}  (输入/输出形状相同)")

    print(f"\n进入 Attention 前（u02 embedding 产出，无上下文）:")
    print(f"「{s1}」中「猫」前4维: {x1[i1, :4].float().numpy()}")
    print(f"「{s2}」中「猫」前4维: {x2[i2, :4].float().numpy()}")
    print("→ 相同 token 向量完全一样（纯查表）")

    print(f"\n离开 Attention 后（吸收上下文）:")
    print(f"「{s1}」中「猫」前4维: {o1[i1, :4].float().numpy()}")
    print(f"「{s2}」中「猫」前4维: {o2[i2, :4].float().numpy()}")
    print("→ 相同 token 向量已分化（随机权重演示，真实模型由训练决定）")


if __name__ == "__main__":
    demo()

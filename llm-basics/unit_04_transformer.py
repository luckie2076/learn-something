"""
04-Transformer：把前三个黑盒「组装」成完整模型

对外接口：
  get_model_and_tokenizer() - 复用 u02/u01 的实例
  forward(text)             - 文本 → logits [1, seq_len, vocab_size]
  predict_next(text, k)     - 文本 → 下一个 token 的 top-k 候选

详细教程: tutorials/unit_04_transformer.md
"""
import torch

import unit_01_tokenization as u01
import unit_02_embeddings as u02


def get_model_and_tokenizer():
    """模型来自 u02，分词器来自 u01 —— 全课程共用同一套"""
    return u02.get_model(), u01.get_tokenizer()


def forward(text: str) -> torch.Tensor:
    """文本 → logits [1, seq_len, vocab_size]
    内部管线: encode → embedding → 24层attention → lm_head 打分
    """
    model, _ = get_model_and_tokenizer()
    ids = u01.encode(text)
    with torch.no_grad():
        return model(torch.tensor([ids])).logits


def predict_next(text: str, k: int = 5) -> list[tuple[int, float]]:
    """取 logits 最后一个位置，softmax 后返回 top-k (token_id, 概率)"""
    probs = torch.softmax(forward(text)[0, -1].float(), dim=-1)
    top = torch.topk(probs, k)
    return [(int(tid), float(p)) for tid, p in zip(top.indices, top.values)]


# ---- 演示 ----
def demo():
    model, tokenizer = get_model_and_tokenizer()
    cfg = model.config
    text = "我知道中国的首都是"
    ids = u01.encode(text)

    print(f"文本: 「{text}」")
    print(f"  u01.encode → token IDs: {ids}")
    print(f"  forward() → logits 形状: [1, {len(ids)}, {cfg.vocab_size:,}]")
    print(f"  模型: {sum(p.numel() for p in model.parameters()) / 1e6:.0f}M 参数"
          f" | 隐藏维度 {cfg.hidden_size} | 词表 {cfg.vocab_size:,}")
    print(f"  predict_next() → top-5 候选:")
    for tid, p in predict_next(text):
        print(f"    「{u01.decode([tid])}」 概率 {p:.4f}")


if __name__ == "__main__":
    demo()

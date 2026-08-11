"""
02-Embeddings：token IDs → 向量

对外接口：
  get_model()            - 懒加载完整模型（全课程唯一的模型入口）
  token_embeddings(text) - 文本 → (token IDs, 向量矩阵 [n_tokens, hidden_dim])
  text_embedding(text)   - 文本 → 句子级向量
  similarity(a, b)       - 两个向量的余弦相似度

详细教程: tutorials/unit_02_embeddings.md
"""
import numpy as np
import torch
from transformers import AutoModelForCausalLM

import unit_01_tokenization as u01

_model = None


def get_model():
    """懒加载完整模型（CPU）：全课程唯一的模型入口，后续单元共用同一实例"""
    global _model
    if _model is None:
        try:
            _model = AutoModelForCausalLM.from_pretrained(
                u01.MODEL_NAME, torch_dtype="auto", local_files_only=True)
        except OSError:
            print(f"首次运行，下载模型 {u01.MODEL_NAME}（约 1GB）...")
            _model = AutoModelForCausalLM.from_pretrained(u01.MODEL_NAME, torch_dtype="auto")
    return _model


def token_embeddings(text: str) -> tuple[list[int], torch.Tensor]:
    """文本 → (token IDs, 向量矩阵 [n_tokens, hidden_dim])"""
    ids = u01.encode(text)
    layer = get_model().model.embed_tokens
    with torch.no_grad():
        embs = layer(torch.tensor(ids))
    return ids, embs


def text_embedding(text: str) -> np.ndarray:
    """句子级向量：所有 token 向量取平均"""
    _, embs = token_embeddings(text)
    return embs.mean(dim=0).float().numpy()


def similarity(a: np.ndarray, b: np.ndarray) -> float:
    """余弦相似度：越接近 1 语义越相近"""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


# ---- 演示 ----
def demo():
    text = "猫是一种可爱的宠物"
    ids, embs = token_embeddings(text)

    print(f"文本: 「{text}」")
    print(f"  u01.encode → token IDs: {ids}")
    print(f"  token_embeddings → 向量形状: {list(embs.shape)}")
    print(f"  逐个 token 向量前 4 维:")
    for tid, piece, emb in zip(ids, u01.decode_each(ids), embs):
        print(f"    「{piece}」(ID {tid:>6}) → {emb[:4].float().numpy()}")

    print(f"\n语义相似度（cosine similarity）:")
    sentences = ["猫是一种可爱的宠物", "狗是人类忠诚的朋友", "今天天气真不错"]
    vecs = [text_embedding(s) for s in sentences]
    for i in range(len(sentences)):
        for j in range(i + 1, len(sentences)):
            print(f"  「{sentences[i]}」⇔「{sentences[j]}」: {similarity(vecs[i], vecs[j]):.4f}")
    print("  (无上下文向量，u03 参与后精度会提升)")


if __name__ == "__main__":
    demo()

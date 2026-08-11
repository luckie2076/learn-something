"""
01-Tokenization：文本 ⇄ token IDs（整条链路的入口与出口）

对外接口：
  MODEL_NAME        - 全课程统一使用的模型名
  get_tokenizer()   - 懒加载分词器
  encode(text)      - 文本 → token ID 列表
  decode(ids)       - token ID 列表 → 文本
  decode_each(ids)  - 逐个 token 解码

详细教程: tutorials/unit_01_tokenization.md
"""
from transformers import AutoTokenizer

MODEL_NAME = "Qwen/Qwen3-0.6B"

_tokenizer = None


def get_tokenizer():
    """懒加载分词器：优先读本地缓存（离线可用），无缓存时自动下载"""
    global _tokenizer
    if _tokenizer is None:
        try:
            _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, local_files_only=True)
        except OSError:
            print(f"首次运行，下载分词器 {MODEL_NAME} ...")
            _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    return _tokenizer


def encode(text: str) -> list[int]:
    """文本 → token ID 列表（不添加 BOS/EOS 等特殊 token）"""
    return get_tokenizer().encode(text, add_special_tokens=False)


def decode(ids: list[int], skip_special_tokens: bool = False) -> str:
    """token ID 列表 → 文本"""
    return get_tokenizer().decode(ids, skip_special_tokens=skip_special_tokens)


def decode_each(ids: list[int]) -> list[str]:
    """逐个 token 解码，用于展示分词效果"""
    tok = get_tokenizer()
    return [tok.decode([tid]) for tid in ids]


# ---- 演示 ----
def demo():
    text = "大语言模型（LLM）是人工智能领域的革命性技术。"
    ids = encode(text)

    print(f"文本: {text}")
    print(f"  encode() → {ids}  ({len(ids)} tokens)")
    print(f"  逐个 token: {decode_each(ids)}")
    print(f"  decode()  → {decode(ids)}  (还原一致: {decode(ids) == text})")


if __name__ == "__main__":
    demo()

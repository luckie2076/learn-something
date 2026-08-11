"""
08-Tool Calling：让模型「调用外部工具」获取实时信息

对外接口：
  define_tool(name, description, parameters) - 定义一个工具（JSON Schema）
  tool_chat(messages, tools, ...)            - 对话 → (回复文本, tool_calls 或 None)
  execute_tool_call(tool_call)               - 执行一个工具调用（演示用）
  tool_call_round(messages, tools, ...)      - 完整一轮：调用工具 → 回喂结果 → 最终回复

详细教程: tutorials/unit_08_tool_calling.md
"""
import json
import re
import unit_01_tokenization as u01
import unit_05_generation as u05


# ---- 工具定义 ----
def define_tool(name: str, description: str, parameters: dict) -> dict:
    """定义一个工具（生成 OpenAI 兼容的 JSON Schema）"""
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": description,
            "parameters": {
                "type": "object",
                "properties": parameters,
                "required": list(parameters.keys()),
            },
        },
    }


# ---- 工具执行（演示用模拟工具） ----
def execute_tool_call(tool_call: dict) -> str:
    """模拟执行工具调用（真实场景替换为 API / 数据库查询等）"""
    name = tool_call["name"]
    args = tool_call.get("arguments", {})

    if name == "get_weather":
        city = args.get("city", "未知")
        data = {
            "北京": "晴天，25°C，湿度 40%",
            "上海": "多云，28°C，湿度 65%",
            "深圳": "阵雨，30°C，湿度 80%",
        }
        return data.get(city, f"{city}天气数据暂不可用")

    if name == "calculator":
        expr = args.get("expression", "")
        try:
            result = eval(expr, {"__builtins__": {}}, {})
            return str(result)
        except Exception as e:
            return f"计算错误: {e}"

    return f"未知工具: {name}"


# ---- 用 Chat Template 注入工具定义 ----
def _pack_messages_with_tools(messages: list[dict], tools: list[dict] | None) -> list[int]:
    """把工具定义嵌入 messages 并打包为 token IDs"""
    tokenizer = u01.get_tokenizer()

    if tools:
        msgs = [{"role": "system", "content": _build_tool_system_prompt(tools)}] + messages
    else:
        msgs = list(messages)

    ids = tokenizer.apply_chat_template(msgs, tokenize=True, add_generation_prompt=True)
    if hasattr(ids, "keys"):
        ids = ids["input_ids"]
    ids = list(ids)
    if ids and isinstance(ids[0], list):
        ids = ids[0]
    return ids


def _build_tool_system_prompt(tools: list[dict]) -> str:
    """构建包含工具定义的系统提示"""
    tool_descriptions = []
    for tool in tools:
        fn = tool["function"]
        params = json.dumps(fn["parameters"], ensure_ascii=False, indent=2)
        tool_descriptions.append(
            f"## {fn['name']}\n{fn['description']}\n参数: {params}"
        )

    return (
        "你是一个可以调用工具的 AI 助手。当需要获取实时信息或执行计算时，"
        "请调用以下工具。调用工具时，必须输出如下格式的 JSON：\n\n"
        '<tool_call>\n{"name": "工具名", "arguments": {"参数名": "参数值"}}\n</tool_call>\n\n'
        "可用工具：\n\n" + "\n".join(tool_descriptions)
    )


def _parse_tool_call(text: str) -> list[dict] | None:
    """从模型输出中提取 <tool_call>...</tool_call> 块"""
    pattern = r"<tool_call>\s*(.*?)\s*</tool_call>"
    matches = re.findall(pattern, text, re.DOTALL)
    if not matches:
        return None

    results = []
    for m in matches:
        try:
            results.append(json.loads(m))
        except json.JSONDecodeError:
            continue
    return results if results else None


# ---- 展示 Prompt 文本 ----
def show_tool_prompt(messages: list[dict], tools: list[dict] | None) -> str:
    """展示模型实际收到的文本（工具定义已嵌入 System Prompt）"""
    ids = _pack_messages_with_tools(messages, tools)
    return u01.decode(ids, skip_special_tokens=False)


# ---- 对外接口 ----
def tool_chat(
    messages: list[dict],
    tools: list[dict] | None = None,
    max_new_tokens: int = 200,
    temperature: float = 0.7,
    seed: int | None = 42,
) -> tuple[str, list[dict] | None]:
    """消息列表 + 工具定义 → (回复文本, tool_calls 或 None)"""
    ids = _pack_messages_with_tools(messages, tools)
    new_ids = u05.generate_ids(ids, max_new_tokens=max_new_tokens,
                               temperature=temperature, seed=seed)
    text = u01.decode(new_ids, skip_special_tokens=False).strip()
    tool_calls = _parse_tool_call(text)
    return text, tool_calls


def tool_call_round(
    messages: list[dict],
    tools: list[dict],
    max_new_tokens: int = 200,
    temperature: float = 0.7,
    seed: int | None = 42,
) -> str:
    """完整一轮：tool_chat → 检测 tool_call → 执行 → 回喂结果 → 最终回复"""
    text, tool_calls = tool_chat(messages, tools, max_new_tokens, temperature, seed)

    if tool_calls:
        results = [execute_tool_call(tc) for tc in tool_calls]

        messages_with_results = list(messages)
        messages_with_results.append({"role": "assistant", "content": text})
        messages_with_results.append({
            "role": "tool",
            "content": json.dumps(results, ensure_ascii=False),
        })

        text2, _ = tool_chat(messages_with_results, tools=None,
                            max_new_tokens=max_new_tokens, temperature=temperature, seed=seed)
        return text2.strip()

    return text


# ---- 演示 ----
def demo():
    weather_tool = define_tool(
        name="get_weather",
        description="获取指定城市的实时天气信息",
        parameters={"city": {"type": "string", "description": "城市名称，如 北京"}},
    )
    calc_tool = define_tool(
        name="calculator",
        description="执行数学计算，支持 + - * / 和括号",
        parameters={"expression": {"type": "string", "description": "数学表达式"}},
    )
    tools = [weather_tool, calc_tool]

    # 演示 1: 需要工具 —— 先展示 Prompt，再展示结果
    print("=" * 55)
    print("演示 1: 问天气 → 模型调用工具")
    print("=" * 55)
    msgs1 = [{"role": "user", "content": "北京今天天气怎么样？"}]
    print(f"【发给模型的文本】\n{show_tool_prompt(msgs1, tools)}\n")

    text, calls = tool_chat(msgs1, tools, seed=42)
    print(f"【模型输出】{text}")
    print(f"【解析的 tool_calls】{json.dumps(calls, ensure_ascii=False, indent=2) if calls else 'None'}")
    if calls:
        for tc in calls:
            print(f"【执行 {tc['name']}】({tc.get('arguments', {})}) → {execute_tool_call(tc)}")
    print(f"\n【最终回复】{tool_call_round(msgs1, tools, seed=42)}")

    # 演示 2: 不需要工具
    print(f"\n{'=' * 55}")
    print("演示 2: 寒暄 → 不调用工具")
    print("=" * 55)
    msgs2 = [{"role": "user", "content": "你好，请介绍一下你自己"}]
    print(f"【发给模型的文本（含工具定义）】\n{show_tool_prompt(msgs2, tools)[:300]}...\n")
    text, calls = tool_chat(msgs2, tools, seed=42)
    print(f"【回复】{text[:80]}...")
    print(f"【tool_calls】{calls}")

    # 演示 3: 计算工具
    print(f"\n{'=' * 55}")
    print("演示 3: 计算 → 调用 calculator")
    print("=" * 55)
    msgs3 = [{"role": "user", "content": "帮我算一下 123 * 456 等于多少"}]
    print(f"【最终回复】{tool_call_round(msgs3, tools, seed=42)}")


if __name__ == "__main__":
    demo()

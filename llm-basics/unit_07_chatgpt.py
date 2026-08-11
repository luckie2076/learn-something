"""
07-Minimal ChatGPT：多轮对话 CLI（全课程总装）

对外接口：
  run_chat(system_prompt) - 启动交互式聊天终端

详细教程: tutorials/unit_07_chatgpt.md
"""
import unit_01_tokenization as u01
import unit_06_prompt as u06


def run_chat(system_prompt: str = "你是一个有帮助的 AI 助手，回答简洁。"):
    """多轮对话：每轮把完整 messages 交给 u06.chat，实现上下文记忆"""
    messages = [{"role": "system", "content": system_prompt}]
    print(f"极简 ChatGPT（{u01.MODEL_NAME}，纯 CPU）| 输入 quit 退出")
    print("-" * 50)

    while True:
        try:
            user_input = input("\n你: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n再见！")
            break
        if not user_input:
            continue
        if user_input.lower() in ("quit", "exit", "q"):
            print("再见！")
            break

        messages.append({"role": "user", "content": user_input})
        reply = u06.chat(messages, max_new_tokens=200)
        print(f"AI: {reply}")
        messages.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    run_chat()

// ===== 可执行文件（src/main.rs）：极薄的 CLI 壳 =====
// 所有逻辑都在库（src/lib.rs）里，这里只负责"读参数 → 调库 → 打印"。
use std::env;
use std::process::exit;

use strtools::{count_words, reverse, to_ascii_upper};

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 3 {
        eprintln!("用法: strtools <count|upper|reverse> <文本...>");
        eprintln!("示例: strtools count \"hello rust\"");
        exit(1);
    }

    let command = args[1].as_str();
    let text = args[2..].join(" ");

    match command {
        "count" => println!("{}", count_words(&text)),
        "upper" => println!("{}", to_ascii_upper(&text)),
        "reverse" => println!("{}", reverse(&text)),
        other => {
            eprintln!("未知命令: {other}");
            exit(1);
        }
    }
}

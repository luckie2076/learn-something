use std::fmt;
use std::fs::File;
use std::io::{self, Read};

// ===== ? 运算符：错误自动向上传播 =====
fn read_username(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?; // 失败直接 return Err
    let mut s = String::new();
    file.read_to_string(&mut s)?;
    Ok(s)
}

// ===== 自定义错误类型 =====
#[derive(Debug)]
struct AgeError;

impl fmt::Display for AgeError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "年龄必须大于 0")
    }
}

impl std::error::Error for AgeError {}

fn check_age(age: i32) -> Result<u32, AgeError> {
    if age > 0 {
        Ok(age as u32)
    } else {
        Err(AgeError)
    }
}

// 越界访问会 panic（此函数不会被执行，仅演示；取消上面注释运行即可体验崩溃）
#[allow(dead_code)]
fn index_beyond() {
    let v = vec![1, 2, 3];
    let _ = v[99]; // 运行到这里会 panic: index out of bounds
}

fn main() {
    // 1. 显式 panic（取消注释运行会崩溃）
    // panic!("出错了");

    // 2. 越界 panic（取消注释运行会崩溃）
    // index_beyond();

    // 3. Result：match 全量处理
    let result = File::open("不存在的文件.txt");
    match result {
        Ok(file) => println!("打开成功: {file:?}"),
        Err(e) => println!("打开失败: {e}"),
    }

    // 4. unwrap_or：失败给默认值，不 panic
    let content = read_username("不存在的文件.txt").unwrap_or_default();
    println!("读取失败时的默认内容: {content:?}");

    // 5. ? 运算符：错误传播给调用方，由 main 里 match 处理
    match read_username("不存在的文件.txt") {
        Ok(name) => println!("用户名: {name}"),
        Err(e) => println!("读取失败（? 传播上来）: {e}"),
    }

    // 6. 自定义错误类型
    match check_age(-5) {
        Ok(a) => println!("年龄 {a}"),
        Err(e) => println!("校验失败: {e}"),
    }
}

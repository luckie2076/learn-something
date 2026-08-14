// ===== 结构体：命名字段 =====
struct User {
    name: String,
    age: u8,
    active: bool,
}

impl User {
    // 关联函数（静态方法），等价构造函数
    fn new(name: String, age: u8) -> Self {
        Self { name, age, active: true }
    }

    // 实例方法：&self 只读借用
    fn greet(&self) {
        println!("你好，{}（{}岁）", self.name, self.age);
    }
}

// 元组结构体：字段没有名字
struct Point(i32, i32);

// ===== 枚举：带数据的联合类型 =====
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

// ===== Option：用类型表达"可能没有值" =====
fn find(haystack: &[i32], needle: i32) -> Option<usize> {
    for (i, &v) in haystack.iter().enumerate() {
        if v == needle {
            return Some(i);
        }
    }
    None
}

fn main() {
    // 结构体实例化
    let u1 = User {
        name: String::from("小明"),
        age: 18,
        active: true,
    };
    println!("u1.name = {}, active = {}", u1.name, u1.active);

    // 方法调用
    let u2 = User::new(String::from("小红"), 20);
    u2.greet();

    // 元组结构体
    let origin = Point(0, 0);
    println!("origin: ({}, {})", origin.0, origin.1);

    // 枚举 + match（穷尽）：逐个构造所有变体
    let coin = Coin::Quarter;
    println!("Quarter = {} 美分", value_in_cents(coin));
    println!("Penny = {} 美分", value_in_cents(Coin::Penny));
    println!("Nickel = {} 美分", value_in_cents(Coin::Nickel));
    println!("Dime = {} 美分", value_in_cents(Coin::Dime));

    // match 解构携带的数据：构造全部三种变体再逐一匹配
    let msgs = [
        Message::Quit,
        Message::Move { x: 10, y: 20 },
        Message::Write(String::from("你好")),
    ];
    for m in msgs {
        match m {
            Message::Quit => println!("退出"),
            Message::Move { x, y } => println!("移动到 ({x}, {y})"),
            Message::Write(text) => println!("写入: {text}"),
        }
    }

    // Option：None 分支必须处理（否则编译失败）
    let nums = [10, 20, 30];
    match find(&nums, 20) {
        Some(i) => println!("找到了，下标 {i}"),
        None => println!("没找到"),
    }

    // if let：只关心一种情况
    let maybe = Some(42);
    if let Some(v) = maybe {
        println!("if let 拿到 {v}");
    }
}

use tokio::time::{sleep, Duration};

// async fn：定义异步函数，返回 Future（不会立即执行）
async fn fetch_data(name: &str) -> String {
    println!("{name}: 开始请求...");
    sleep(Duration::from_millis(300)).await; // 模拟网络等待（异步等待，不阻塞线程）
    println!("{name}: 完成");
    format!("{name} 的数据")
}

#[tokio::main] // 宏：自动启动 tokio 运行时
async fn main() {
    // 串行：一个 await 完成才开始下一个（总耗时约 600ms）
    let a = fetch_data("请求A").await;
    let b = fetch_data("请求B").await;
    println!("串行结果: {a}, {b}");

    println!("-------------------");

    // 并发：tokio::spawn 把 Future 交给运行时并行调度（总耗时约 300ms）
    let handle1 = tokio::spawn(fetch_data("并发1"));
    let handle2 = tokio::spawn(fetch_data("并发2"));
    let r1 = handle1.await.expect("任务1失败");
    let r2 = handle2.await.expect("任务2失败");
    println!("并发结果: {r1}, {r2}");
}

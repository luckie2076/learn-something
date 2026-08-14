// ===== 泛型：一份代码，多种类型 =====
pub fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

// ===== trait：Rust 的"接口" =====
pub trait Shape {
    fn area(&self) -> f64;

    // 默认方法：trait 里直接给出实现，类型可以不覆盖
    fn description(&self) -> String {
        format!("面积为 {:.2} 的形状", self.area())
    }
}

pub struct Circle {
    pub radius: f64,
}

pub struct Rectangle {
    pub width: f64,
    pub height: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
    // 不实现 description()：直接用默认实现
}

impl Shape for Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
    // 覆盖默认实现
    fn description(&self) -> String {
        format!("矩形 {}x{}，面积 {:.2}", self.width, self.height, self.area())
    }
}

// ===== 标准库 trait：让类型"接入"标准库工具 =====
// 实现 Display 后，println!("{circle}") 直接可用
impl std::fmt::Display for Circle {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Circle(r={})", self.radius)
    }
}

// ===== trait 作为参数：impl Trait 语法（编译期多态）=====
pub fn area(shape: &impl Shape) -> f64 {
    shape.area()
}

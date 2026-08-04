"use strict";
// ts-syntax-demo.ts —— TypeScript 重点语法速览
// 1. 基础类型注解
let count = 10;
const userName = "Alice"; // 注意别用 name，会和 DOM 全局的 window.name 冲突
const isDone = false;
let s = "loading";
const u = { id: 1, name: "Bob", role: "user" };
// 5. 泛型函数
function first(arr) {
    return arr[0];
}
const n = first([1, 2, 3]); // 3. number
const str = first(["a", "b"]); // 类型推断为 string
// 6. 泛型约束
function longest(a, b) {
    return a.length >= b.length ? a : b;
}
// 7. 类 + 访问修饰符 + 参数属性
class Counter {
    step;
    _value = 0;
    constructor(step = 1) {
        this.step = step;
    }
    increment() {
        this._value += this.step;
    }
    get value() {
        return this._value;
    }
}
// 8. 元组
const pair = [1, "one"];
// 9. 枚举
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
// 10. 类型守卫
function isString(x) {
    return typeof x === "string";
}
// 注意：不要叫 print，会和 DOM 全局的 print(): void 合并成不兼容重载（TS2394）
function printValue(x) {
    if (isString(x)) {
        console.log(x.toUpperCase()); // 此处 x 被收窄为 string
    }
    else {
        console.log(x.toFixed(2)); // 此处 x 被收窄为 number
    }
}
// 11. 可空与可选链 / 空值合并
// 用函数参数承载 User | null，TS 才会在内部把它当真正的联合类型（而非收窄成 never）
function getName(maybe) {
    return maybe?.name ?? "匿名"; // maybe 为 null/undefined 时回退到 "匿名"
}
console.log(getName(u)); // u 是 User → "Bob"
console.log(getName(null)); // null → "匿名"
const onStatus = (code) => console.log("code:", code);
// 运行一下看看效果
const c = new Counter(2);
c.increment();
console.log({ count, userName, isDone, s, u, n, str, pair, dir: Direction.Up, value: c.value });
printValue("hello");
printValue(3.14159);

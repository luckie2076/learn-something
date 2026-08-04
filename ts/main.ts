// ts-syntax-demo.ts —— TypeScript 重点语法速览

// 1. 基础类型注解
let count: number = 10;
const userName: string = "Alice"; // 注意别用 name，会和 DOM 全局的 window.name 冲突
const isDone: boolean = false;

// 2. 联合类型 + 字面量类型
type Status = "success" | "error" | "loading";
let s: Status = "loading";

// 3. 接口（结构类型）
interface User {
  id: number;
  name: string;
  email?: string; // 可选属性
  readonly role: "admin" | "user"; // 只读
}

const u: User = { id: 1, name: "Bob", role: "user" };

// 4. 类型别名 + 交叉类型
type Timestamp = { createdAt: Date };
type LogEntry = User & Timestamp;

// 5. 泛型函数
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const n = first<number>([1, 2, 3]); // 3. number
const str = first(["a", "b"]);      // 类型推断为 string

// 6. 泛型约束
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

// 7. 类 + 访问修饰符 + 参数属性
class Counter {
  private _value = 0;
  constructor(public step: number = 1) {}

  increment(): void {
    this._value += this.step;
  }
  get value(): number {
    return this._value;
  }
}

// 8. 元组
const pair: [number, string] = [1, "one"];

// 9. 枚举
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// 10. 类型守卫
function isString(x: unknown): x is string {
  return typeof x === "string";
}
// 注意：不要叫 print，会和 DOM 全局的 print(): void 合并成不兼容重载（TS2394）
function printValue(x: string | number) {
  if (isString(x)) {
    console.log(x.toUpperCase()); // 此处 x 被收窄为 string
  } else {
    console.log(x.toFixed(2));    // 此处 x 被收窄为 number
  }
}

// 11. 可空与可选链 / 空值合并
// 用函数参数承载 User | null，TS 才会在内部把它当真正的联合类型（而非收窄成 never）
function getName(maybe: User | null): string {
  return maybe?.name ?? "匿名"; // maybe 为 null/undefined 时回退到 "匿名"
}
console.log(getName(u));     // u 是 User → "Bob"
console.log(getName(null));  // null → "匿名"

// 12. 函数类型与回调
type Handler = (code: number) => void;
const onStatus: Handler = (code) => console.log("code:", code);

// 运行一下看看效果
const c = new Counter(2);
c.increment();
console.log({ count, userName, isDone, s, u, n, str, pair, dir: Direction.Up, value: c.value });
printValue("hello");
printValue(3.14159);

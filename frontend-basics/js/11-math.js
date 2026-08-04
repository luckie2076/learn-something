// 模块文件：用 export 暴露"对外接口"，其余都是私有的（外部拿不到）。
// 这就是模块解决"全局污染"的办法——不导出的东西，外面看不见。

export const PI = 3.14;

export function add(x, y) {
  return x + y;
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// cn = className 合并工具
// 作用：① 用 clsx 把「条件类名」拼成字符串；② 用 tailwind-merge 解决冲突类名
// 例：cn("p-2", cond && "p-4") 中后写的 p-4 会覆盖 p-2，而不是两者共存
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

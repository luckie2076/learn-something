import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// cn = className 合并工具
// 作用：① 用 clsx 把「条件类名」拼成字符串；② 用 tailwind-merge 解决冲突类名
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

#!/usr/bin/env node
// 一个最小可运行的「脚手架」CLI：把 template/ 目录复制到目标路径，
// 并把模板里的 __PROJECT_NAME__ 占位符替换成目录名。
// 全程只用了 Node 内置模块（node:fs / node:path / node:url），零第三方依赖。
import { mkdirSync, readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateDir = join(__dirname, 'template');
const target = process.argv[2]; // 第一个命令行参数：生成到哪个目录

if (!target) {
  console.error('用法: node index.js <目标目录>');
  process.exit(1);
}

// 递归拷贝目录；文件内容里若出现 __PROJECT_NAME__ 则替换成项目名。
function copyDir(from, to, name) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    const src = join(from, entry);
    const dest = join(to, entry);
    if (statSync(src).isDirectory()) {
      copyDir(src, dest, name); // 子目录继续递归
    } else {
      const content = readFileSync(src, 'utf8').replaceAll('__PROJECT_NAME__', name);
      writeFileSync(dest, content);
    }
  }
}

copyDir(templateDir, target, basename(target));
console.log(`✅ 已在 ${target} 生成项目骨架（基于模板 ${templateDir}）`);

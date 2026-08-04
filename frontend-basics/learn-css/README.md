# learn-css

CSS 渐进式学习练习。每个文件聚焦一个主题，代码刻意保持极简，**重点在注释里讲清「为什么这样做」**，而不是罗列属性用法。

> 学习顺序建议按文件编号从 0 到 14 依次看。它们是一个由「世界观 → 布局 → 视觉 → 响应式/动效」的递进关系。

## 文件导览

| 文件 | 主题 | 核心「为什么」 |
| ---- | ---- | ------------ |
| [`00-00-basics.html`](00-00-basics.html) · [`00-01-inline.html`](00-01-inline.html) · [`00-02-internal.html`](00-02-internal.html) · [`00-03-external.html`](00-03-external.html) | 引入与基本语法 | 总览 00-00，再按序练习 00-01~00-03：内联 `style` / 内部 `<style>` / 外部 `<link>`（配 [`00-03-styles.css`](00-03-styles.css)）。为什么正式项目用外部样式表（复用、缓存、关注点分离）？规则结构：`选择器 { 属性: 值 }`。 |
| [`01-selectors.html`](01-selectors.html) | 选择器 | 为什么需要选择器？它是「给元素贴地址」。基础（元素/类/ID/通配符）、组合（后代/子/相邻）、分组。为什么类比 ID 更常用（可复用、可叠加）。 |
| [`02-box-model.html`](02-box-model.html) | 盒模型 ★核心 | 为什么 CSS 把每个元素当成「盒子」？content/padding/border/margin 四层。为什么 `box-sizing: border-box` 几乎是必选项（避免尺寸计算陷阱）。为什么 margin 会「塌陷」。 |
| [`03-units.html`](03-units.html) | 单位与尺寸 | 为什么不能用死 `px` 定全局字号（无障碍/缩放）？`em` 相对父、`rem` 相对根——为什么 `rem` 更适合统一缩放。`vw/vh` 与视口；`%` 相对谁。 |
| [`04-display-flow.html`](04-display-flow.html) | 显示模式与文档流 | 为什么元素默认有 `block`/`inline` 之分（是否占满行、能否设宽高）？`inline-block` 的缝隙问题为何出现。**普通文档流（normal flow）是什么**——后续所有布局的前提。 |
| [`05-position.html`](05-position.html) | 定位 position | 为什么需要 `position`（脱离/不脱离文档流）？`static/relative/absolute/fixed/sticky` 各自「相对谁」。为什么 `absolute` 要找「最近的定位祖先」（包含块 containing block）。 |
| [`06-flexbox.html`](06-flexbox.html) | Flexbox 一维布局 | 为什么 Flex 出现（解决 `float` 清浮动的痛苦）？主轴/交叉轴；`justify-content`/`align-items`。为什么 `flex: 1` 能等分空间。 |
| [`07-grid.html`](07-grid.html) | Grid 二维布局 | 为什么需要 Grid（行+列同时控制）？与 Flex 的取舍：一维用 Flex，二维用 Grid。`fr` 单位、`grid-template`、`gap`。 |
| [`08-cascade.html`](08-cascade.html) | 层叠、继承与优先级 ★难点 | 为什么多条规则作用同一元素会「冲突」？浏览器按「来源 → 特异性 → 顺序」解决。特异性怎么算（ID > 类 > 元素）。继承是什么；为什么有些属性不继承。`!important` 为何是「最后手段」。 |
| [`09-typography.html`](09-typography.html) | 文本与排版 | 为什么 `line-height` 用无单位值更稳？`font` 简写顺序陷阱；字体系列回退（fallback）为什么必要。 |
| [`10-color-bg.html`](10-color-bg.html) | 颜色、背景与渐变 | 为什么用 `hsl`/`rgb` 比 `hex` 更可控（透明度、调色）？背景图与背景色如何层叠；`gradient` 本质是「图片」。 |
| [`11-border-shadow.html`](11-border-shadow.html) | 边框、圆角与阴影 | `border-radius` 原理；`box-shadow` 多层阴影；为什么用阴影而非边框做层次感。 |
| [`12-pseudo.html`](12-pseudo.html) | 伪类与伪元素 | 为什么 `:hover`/`:focus` 重要（交互/无障碍）？`::before`/`::after` 与 `content` 的妙用（装饰、历史清浮动方案）。 |
| [`13-responsive.html`](13-responsive.html) | 响应式设计 | 为什么「移动优先（mobile-first）」（渐进增强 vs 优雅降级）？媒体查询怎么断点；为什么用 `em` 断点更稳。与 HTML `viewport` 的呼应。 |
| [`14-animation.html`](14-animation.html) | 过渡与动画 | 为什么动画优先用 `transform`/`opacity`（合成层/性能）而非 `left`/`top`？`transition` 三要素；`@keyframes` 自定义关键帧。 |

### 可选进阶（按需补充）

- `15-variables.html` — CSS 变量（`--x`）与设计令牌：为什么用变量做主题切换与统一管理；`:root` 作用域；与预处理器变量的区别。

## 一条贯穿始终的主线

CSS 的难点不在于「有哪些属性」，而在于三条主线，掌握它们后其余属性都是「锦上添花」：

1. **盒模型**——你操作的对象到底是什么（每个元素都是盒子，由四层构成）；
2. **文档流与定位**——元素默认怎么摆放、又如何「脱离」默认流；
3. **层叠与特异性**——当多条规则冲突时，到底「谁说了算」。

> 与 HTML 的呼应：HTML 负责「这是什么（语义）」，CSS 负责「这看起来怎样（表现）」。本组练习延续「把含义留在 HTML，把表现交给 CSS」的思路——但 CSS 自己的「为什么」转向三个工程问题：**可预测性（盒模型）、可控性（文档流/定位）、可维护性（层叠/变量）**。

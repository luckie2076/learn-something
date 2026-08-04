// 阶段二：用 TS 写源码（Vite 8 用 Oxc 转译）。
// 阶段三：下面两行分别引入「全局 Sass」和「CSS Modules 化的 Sass」。
import './style.scss';
import styles from './style.module.scss';
// 阶段四：import 非 JS 资源 —— 都由 Vite 的插件在 transform 阶段编译成 JS 模块。
import logoUrl from './load.jpg'; // 默认导出：该图片在产物里的 URL 字符串
import info from './data.json'; // 默认导出：解析后的 JS 对象

const app = document.querySelector<HTMLDivElement>('#app')!;
app.className = styles.card; // CSS Modules：styles.card 是构建时被哈希化的唯一类名

// import 进来的 png：拿到的是 URL（小图被 Vite 内联成 base64 data URL），直接喂给 <img>
const img = document.createElement('img');
img.src = logoUrl;
img.alt = 'logo';
img.width = 48;
img.style.marginLeft = '8px';

// import 进来的 json：拿到的是普通对象，直接读字段
app.textContent = `${info.greeting}（来自 data.json，stage=${info.stage}）`;
app.appendChild(img);

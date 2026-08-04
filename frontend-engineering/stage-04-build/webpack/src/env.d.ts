// 给「非 JS 资源」补上 TS 类型声明，否则 import './logo.png' / '*.scss' 会报「找不到模块」。
// 注意：这纯粹是给 TS 看的「声明」，不影响运行时——运行时怎么变成 JS 由 loader 决定。
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.scss' {
  const content: string;
  export default content;
}
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

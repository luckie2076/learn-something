// 一个极简「组件」：不依赖任何框架，返回一个 DOM 元素并绑定交互。
// 组件测试的关注点正是：给定初始状态，用户操作后 DOM 如何变化。
export function createCounter(initial = 0) {
  const root = document.createElement('div');
  root.innerHTML = `
    <button class="dec">-</button>
    <span class="value">${initial}</span>
    <button class="inc">+</button>
  `;

  let count = initial;
  const valueEl = root.querySelector('.value');

  const render = () => {
    valueEl.textContent = String(count);
  };

  root.querySelector('.inc').addEventListener('click', () => {
    count += 1;
    render();
  });
  root.querySelector('.dec').addEventListener('click', () => {
    count -= 1;
    render();
  });

  return root;
}

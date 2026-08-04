// 第三方包：先在 package.json 里 pnpm add 装好，再在此处 import 才真正"用上"。
import _ from 'lodash';

console.log('lodash.chunk([1,2,3,4,5], 2) =', _.chunk([1, 2, 3, 4, 5], 2));

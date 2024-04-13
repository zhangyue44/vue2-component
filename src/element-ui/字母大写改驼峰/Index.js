/**
 * 对于非边界的大写字母，改为驼峰写法
 * \B就是查找非边界位置 \b是查找边界位置
 * \B匹配的是前后都是字母数字字符的地方
 */

const hyphenateRE = /\B([A-Z])/g;
const hyphenate = function (str) {
  return str.replace(hyphenateRE, "-$1").toLowerCase();
};

console.log(hyphenate("SfsDgsgs")); // sfs-dgsgs

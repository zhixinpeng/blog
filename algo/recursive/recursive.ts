/**
 * 递归求解爬楼梯问题
 */

/**
 * 最开始版本的递归算法
 * @param n
 */
function fn(n: number): any {
  if (n === 1) return 1;
  if (n === 2) return 2;
  return fn(n - 1) + fn(n - 2)
}

/**
 * 使用depth结合js的闭包特定实现限制函数调用次数的功能
 * @param depth 递归的深度
 */
function fnWidthDepth(depth: number) {
  return function fn(n: number): any {
    depth++;
    if (depth > 1000) throw new Error("function stack is too deep!");
    if (n === 1) return 1;
    if (n === 2) return 2;
    return fn(n - 1) + fn(n - 2);
  }
}

/**
 * 使用map来存储已经计算过的值，避免递归重复计算
 */
function fnWithMap() {
  const map = new Map<number, number>();
  return function fn(n: number): any {
    if (n === 1) return 1;
    if (n === 2) return 2;
    if (map.has(n)) {
      return map.get(n);
    }
    const ret = fn(n - 1) + fn(n - 2);
    map.set(n, ret);
    return ret;
  }
}
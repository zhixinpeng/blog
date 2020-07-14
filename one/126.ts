/**
 * 逆向：即从桌牌到手牌
 * @param {*} 桌牌序列 arr 
 */
function recover(arr: number[]) {
  const res: number[] = []
  while (arr.length > 0) {
    if (res.length) {
      res.push(res.shift()!)
    }
    const item = arr.pop()
    res.push(item!)
  }
  return res
}

/**
* 正向：即从手牌到桌牌（用于检验结果）
* @param {*} 手牌序列arr 
*/
function generate(arr: number[]) {
  const res = []
  while (arr.length > 0) {
    const item = arr.pop()
    res.push(item)
    if (arr.length) {
      arr.unshift(arr.pop()!)
    }
  }
  return res
}

recover([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])   // [7, 10, 6, 13, 5, 9, 4, 11, 3, 8, 2, 12, 1]
generate([7, 10, 6, 13, 5, 9, 4, 11, 3, 8, 2, 12, 1])  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
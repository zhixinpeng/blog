/**
 * O(n)时间复杂度内求无序数组的第K大元素
 * 如[3,2,4,12,3]的第3大元素就是4
 * 使用分治和分区的思想
 */
class KthNumber {
  getKthNumber(array: number[], k: number): number {
    const length = array.length;
    if (k > length) return -1;

    let q = this.partition(array, 0, array.length - 1);
    while (q + 1 !== k) {
      if (q + 1 > k) {
        q = this.partition(array, 0, q - 1);
      } else {
        q = this.partition(array, q + 1, length - 1);
      }
    }
    return array[q];
  }

  /**
   * 和快速排序一样
   * @param array 数组的一部分
   * @param p 开始坐标
   * @param r 结束坐标
   */
  private partition(array: number[], p: number, r: number) {
    const pivot = array[p];
    let index = p + 1;
    for (let i = index; i <= r; i++) {
      if (array[i] < pivot) {
        this.swap(array, index, 1);
        index++;
      }
    }
    this.swap(array, p, index - 1);
    return index - 1;
  }

  private swap(array: number[], p: number, q: number) {
    const temp = array[p];
    array[p] = array[q];
    array[q] = temp;
  }
}

const test = [4, 2, 5, 12, 3];
const kthNum = new KthNumber();
const num = kthNum.getKthNumber(test, 3);
console.log(num);
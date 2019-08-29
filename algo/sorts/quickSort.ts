/**
 * 快速排序
 * 不稳定排序
 * 原地排序，空间复杂度O(1)，比归并排序使用更广泛
 * 平均时间复杂度基本接近O(nlogn)
 */
export class QuickSort {
  static sort(array: number[]): void {
    this.sortInternally(array, 0, array.length - 1);
  }

  private static sortInternally(array: number[], p: number, r: number) {
    if (p >= r) return;
    // 获取分界点
    const q: number = this.partition(array, p, r);
    this.sortInternally(array, p, q - 1);
    this.sortInternally(array, q + 1, r);
  }

  /**
   * 参考返回值pivot，小于pivot的放在左边，大于pivot的放在右边，最后再把分界点的值和它做交换
   * 这样返回的index一定是值在中间的下标
   */
  private static partition(array: number[], p: number, r: number): number {
    const pivot = array[p];
    let index = p + 1;
    for (let i = index; i <= r; i++) {
      if (array[i] < pivot) {
        this.swap(array, index, i);
        // 找到了比标记值晓得元素就移动分解点
        index++
      }
    }
    this.swap(array, p, index - 1);
    return index - 1;
  }

  private static swap(array: number[], p: number, q: number) {
    const temp = array[p];
    array[p] = array[q];
    array[q] = temp;
  }
}

const testSort = [27,38,12,39,27,16]
QuickSort.sort(testSort)
console.log(testSort)
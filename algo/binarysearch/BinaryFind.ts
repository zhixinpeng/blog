/**
 * 二分查找在实际场合中使用不多
 * 我们更多的是看到一些查找法的变种
 */
class BinaryFind {
  /**
   * 在数组中查找第一个等于给定值的位置
   * @param array 给定的范围数组
   * @param target 要查找的目标值
   */
  static findFirstElement(array: number[], target: number) {
    const length = array ? array.length : null
    if (!length || length === 0) return -1
    let low = 0;
    let high = length - 1;
    while (low <= high) {
      const mid = low + ((high - low) >> 1)
      if (array[mid] > target) {
        high = mid - 1
      } else if (array[mid] < target) {
        low = mid + 1
      } else {
        if (mid === 0 || array[mid - 1] < target) {
          return mid
        } else {
          high = mid - 1
        }
      }
    }
    return -1
  }

  /**
   * 在数组中查找最后一个等于给定值的位置
   * @param array 给定的范围数组
   * @param target 要查找的目标值
   */
  static findLastElement(array: number[], target: number) {
    const length = array ? array.length : null
    if (!length || length === 0) return -1
    let low = 0
    let high = length - 1
    while (low <= high) {
      const mid = low + ((high - low) >> 1)
      if (array[mid] > target) {
        high = mid - 1
      } else if (array[mid] > target) {
        low = mid + 1
      } else {
        if (mid === length - 1 || array[mid + 1] !== target) {
          return mid
        } else {
          low = mid + 1
        }
      }
    }
    return -1
  }

  /**
   * 在数组中查找第一个大于给定值的位置
   * @param array 给定的范围数组
   * @param target 要查找的目标值
   */
  static findFirstElementGreaterThanTarget(array: number[], target: number) {
    const length = array ? array.length : null
    if (!length || length === 0) return -1
    let low = 0
    let high = length - 1
    while (low <= high) {
      const mid = low + ((high - low) >> 1)
      if (array[mid] < target) {
        low = mid + 1
      } else {
        if (mid === 0 || array[mid - 1] < target) {
          return mid
        } else {
          high = mid - 1
        }
      }
    }
    return -1
  }

  /**
   * 在数组中查找最后一个小于给定值的位置
   * @param array 给定的范围数组
   * @param target 要查找的目标值
   */
  static findLastElementLessThanTarget(array: number[], target: number) {
    const length = array.length
    if (!length) return -1
    let low = 0
    let high = length - 1
    while (low <= high) {
      const mid = low + ((high - low) >> 1)
      if (array[mid] > target) {
        high = mid - 1
      } else {
        if (mid === length - 1 || array[mid + 1] > target) {
          return mid
        } else {
          low = mid + 1
        }
      }
    }
    return -1
  }
}

const binaryFindTest = [1, 3, 4, 4, 5, 6, 8, 8, 8, 11, 18]
const target = BinaryFind.findLastElementLessThanTarget(binaryFindTest, 4)
console.log(target)
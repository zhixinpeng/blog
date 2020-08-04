// 冒泡排序
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let flag = false
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                flag = true
            }
        }
        if (!flag) break
    }
}

// 插入排序
function insertSort(arr) {
    if (arr.length <= 1) return
    for (let i = 1; i < arr.length; i++) {
        let value = arr[i]
        let j = i - 1
        for (; j >= 0; j--) {
            if (arr[j] > value) {
                arr[j + 1] = arr[j]
            } else {
                break
            }
        }
        arr[j + 1] = value
    }
}

// 选择排序
function selectSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        if (minIndex !== i) {
            let temp = arr[minIndex]
            arr[minIndex] = arr[i]
            arr[i] = temp
        }
    }
}

// 归并排序
function mergeSort(arr) {
    resolve(arr, 0, arr.length - 1)

    // 分解
    function resolve(arr, start, end) {
        if (start >= end) return
        let mid = Math.floor(start + ((end - start) >> 1))

        resolve(arr, start, mid)
        resolve(arr, mid + 1, end)

        merge(arr, start, mid, end)
    }

    // 合并
    function merge(arr, start, mid, end) {
        // 双指针
        let i = start
        let j = mid + 1
        // 临时存放数组及指针
        let k = 0
        const temp = []

        // 双指针一起跑
        while (i <= mid && j <= end) {
            if (arr[i] < arr[j]) {
                temp[k++] = arr[i++]
            } else {
                temp[k++] = arr[j++]
            }
        }

        // 得到最后没存放的首位索引
        // 由于我们使用的 Math.floor 下标，所有左边的索引范围一般会比右边大
        // start 和 mid 可能相等
        let head = j <= end ? j : i
        let tail = j <= end ? end : mid

        // 依次存放
        while (head <= tail) {
            temp[k++] = arr[head++]
        }

        // 将最后得到的 temp 数组值拷贝回原数组
        for (i = 0; i <= end - start; i++) {
            arr[start + i] = temp[i]
        }
    }
}

// 快速排序
function quickSort(arr) {
    quick(arr, 0, arr.length - 1)

    function quick(arr, start, end) {
        if (start >= end) return
        const portal = partition(arr, start, end)
        quick(arr, start, portal - 1)
        quick(arr, portal + 1, end)
    }

    function partition(arr, start, end) {
        // 任意指定一个值作为分界点
        const portal = arr[end]
        // 初始化分界点指针
        let index = start

        for (let i = start; i < end; i++) {
            if (arr[i] < portal) {
                swap(arr, index, i)
                index++
            }
        }

        swap(arr, index, end)
        return index
    }

    function swap(arr, i, j) {
        if (i === j) return
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
}

// 寻找数组中的第 K 大元素
function findK(arr, k) {
    if (!arr || arr.length < k) return -1
    let portal = partition(arr, 0, arr.length - 1)
    while (portal + 1 !== k) {
        // 第 k 大元素在分界点左边
        if (portal + 1 > k) {
            portal = partition(arr, 0, portal - 1)
        } else {
            portal = partition(arr, portal + 1, arr.length - 1)
        }
    }
    return arr[portal]

    function partition(arr, start, end) {
        // 任意指定一个值作为分界点
        const portal = arr[end]
        // 初始化分界点指针
        let index = start

        for (let i = start; i < end; i++) {
            if (arr[i] >= portal) {
                swap(arr, index, i)
                index++
            }
        }

        swap(arr, index, end)
        return index
    }

    function swap(arr, i, j) {
        if (i === j) return
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
}

// 桶排序
function bucketSort(arr) {
    // 第一步确定数据的最小值、最大值
    let min = arr[0]
    let max = arr[0]
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i]
        } else if (arr[i] > max) {
            max = arr[i]
        }
    }

    // 第二步初始化桶
    // 假设每个桶里只能装下 5 个数据
    const bucketSize = 5
    // 根据数据的大小区间计算需要的桶数量，这样每个桶就有了对应负责存放的区间值
    const bucketCount = Math.floor((max - min) / bucketSize) + 1
    const buckets = new Array(bucketCount)
    for (let i = 0; i < bucketCount; i++) {
        buckets[i] = []
    }

    // 第三步把数据分别放到这些桶里面去
    for (let i = 0; i < arr.length; i++) {
        // 根据数据的大小分配到对应的桶中去，数据越大，桶的索引越大
        buckets[Math.floor((arr[i] - min) / bucketSize)].push(arr[i])
    }

    // 第四步给每个桶进行排序，完事后再依次插入到数组中
    arr.length = 0
    for (let i = 0; i < bucketCount; i++) {
        // 对每个桶使用快速排序
        quickSort(buckets[i])
        for (let j = 0; j < buckets[i].length; j++) {
            arr.push(buckets[i][j])
        }
    }
    return arr
}

// 计数排序
function countingSort(arr) {
    // 第一步计算最大值
    let max = arr[0]
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i]
        }
    }

    // 第二步初始化数据范围数组并计算每个数出现的次数
    const countArray = new Array(max + 1).fill(0)
    for (let i = 0; i < arr.length; i++) {
        countArray[arr[i]]++
    }
    // 将出现次数累加起来，这样每个元素的值就是它在原数组中的排名索引
    for (let i = 0; i < max + 1; i++) {
        countArray[i] = countArray[i] + countArray[i - 1]
    }

    // 第三步开始计数排序
    const sortedArray = []
    for (let i = arr.length - 1; i >= 0; i--) {
        // 累加起来的值实际就是排名，从而可以得到它的索引
        const index = countArray[arr[i]] - 1
        sortedArray[index] = arr[i]
        countArray[arr[i]]--
    }

    // 第四步将排序完的数组复制回去
    for (let i = 0; i < arr.length; i++) {
        arr[i] = sortedArray[i]
    }
}

const testSort = [1, 3, 2, 3, 10, 9, 7, 6, 0, 12]
console.log(bucketSort(testSort))

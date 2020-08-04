// 模拟实现数组查找方法
function findIndex(array, predicate, context) {
    for (let i = 0; i < array.length; i++) {
        if (predicate.call(context, array[i], i, array)) return i
    }
    return -1
}

function findLastIndex(array, predicate, context) {
    const length = array.length
    for (let i = length - 1; i >= 0; i--) {
        if (predicate.call(context, array[i], i, array)) return i
    }
    return -1
}

// 综合以上，避免冗余代码
function createIndexFinder(dir) {
    return function (array, predicate, context) {
        const length = array.length
        let index = dir > 0 ? 0 : length - 1

        for (; index >= 0 && index < length; index += dir) {
            if (predicate.call(context, array[index], index, array)) return index
        }

        return -1
    }
}

// 在一个排好序的数组中找到 value 对应的位置
// sortedIndex([10, 20, 30], 25); // 2
function sortedIndex(array, obj) {
    let low = 0,
        high = array.length

    while (low < high) {
        let mid = low + ((high - low) >> 2)
        if (array[mid] < obj) low = mid + 1
        else high = mid
    }

    return high
}

// stooges 配角 比如 三个臭皮匠 The Three Stooges
// var stooges = [{name: 'stooge1', age: 10}, {name: 'stooge2', age: 30}];

// var result = sortedIndex(stooges, {name: 'stooge3', age: 20}, function(stooge){
//     return stooge.age
// });

// console.log(result) // 1

// 加强版
function cb(func, context) {
    if (context === void 0) return func
    return function () {
        return func.apply(context, arguments)
    }
}

function sortedIndex1(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context)

    let low = 0,
        high = array.length
    while (low < high) {
        let mid = low + ((high - low) >> 2)
        if (iteratee(array[mid] < iteratee(obj))) low = mid + 1
        else high = mid
    }

    return high
}

// 模拟实现indexOf和lastIndexOf
function createIndexOfFinder(dir) {
    return function (array, item, idx) {
        const length = array.length
        let i = 0

        if (typeof idx === 'number') {
            if (dir > 0) {
                i = idx >= 0 ? idx : Math.max(length + idx, 0)
            } else {
                length = idx > 0 ? Math.min(idx + 1, length) : idx + length + 1
            }
        }

        for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
            if (array[idx] === item) return idx
        }

        return -1
    }
}

/**
 * 数组扁平化
 * @param {*} arr 原数组
 */
function flatten(arr) {
    const result = []
    for (let i = 0, len = arr.length; i < len; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]))
        } else {
            result.push(arr[i])
        }
    }
    return result
}

// 元素都是数字可以使用 toString
;[1, [2, [3, 4]]].toString()

function flatten1(arr) {
    return arr.reduce((prev, next) => prev.concat(Array.isArray(next) ? flatten(next) : next), [])
}

function flatten2(arr) {
    return [].concat(...arr)
}

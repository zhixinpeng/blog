/**
 * 对象深拷贝
 * @param {*} obj 被拷贝对象
 */
function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) return obj
    const newObj = obj instanceof Array ? [] : {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
        }
    }
    return newObj
}

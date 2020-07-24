/**
 * 基础版本的防抖
 * @param func 执行函数
 * @param wait 停止触发函数后延迟执行的时间
 */
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout
    return function (this: any) {
        let context = this
        let args = arguments
        clearTimeout(timeout)
        timeout = setTimeout(function () {
            func.apply(context, args)
        }, wait)
    }
}

/**
 * 加上了立即执行功能的防抖并带返回值
 * @param func 执行函数
 * @param wait 停止触发函数后延迟执行的时间
 * @param immediate 是否立即执行一次
 */
function debounceImmediate(func: Function, wait: number, immediate: boolean): Function {
    let timeout: NodeJS.Timeout | null
    let result: any
    let debounced = function (this: any) {
        let context = this
        let args = arguments
        if (timeout) clearTimeout(timeout)
        if (immediate) {
            let callNow = !timeout
            timeout = setTimeout(function () {
                timeout = null
            }, wait)

            if (callNow) result = func.apply(context, args)
        } else {
            // 在 immediate 为 false 的情况下，函数执行的返回值包裹在 setTimeout 中，return 值会一直是 undefined
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, wait)
        }
        return result
    }

    // debounced.cancel = function () {
    //     clearTimeout(timeout)
    //     timeout = null
    // }

    return debounced
}

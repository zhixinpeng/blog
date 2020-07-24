/**
 * 节流函数
 * @param {*} func 执行函数
 * @param {*} wait 延迟时间
 * @param {*} options 配置选项 leading: false 表示禁用第一次执行 trailing: false 表示禁用停止触发的回调
 */
function throttle(func, wait, options) {
    let context, timeout, args, result
    let previous = 0

    let later = function () {
        previous = options.leading === false ? 0 : +new Date()
        timeout = null
        func.apply(context, args)
        if (!timeout) context = args = null
    }

    let throttled = function () {
        let now = +new Date()
        if (!previous && options.leading === false) previous = now
        let remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            previous = now
            func.apply(context, args)
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining)
        }
    }

    throttled.cancel = function () {
        clearTimeout(timeout)
        previous = 0
        timeout = null
    }

    return throttled
}

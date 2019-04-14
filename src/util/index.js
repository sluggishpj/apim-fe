export function throttle(method, timeSapn = 300) {
    let timerId = null
    let that = this
    return function(...args) {
        clearTimeout(timerId)
        timerId = setTimeout(() => {
            method.apply(that, args)
        }, timeSapn)
    }
}

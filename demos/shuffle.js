// Fisher-Yates 洗牌算法
function shuffle(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * i)
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])

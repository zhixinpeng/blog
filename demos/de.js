var findOrder = function (numCourses, prerequisites) {
    const inDegree = new Array(numCourses).fill(0)
    const map = {}
    for (let i = 0; i < prerequisites.length; i++) {
        inDegree[prerequisites[i][0]]++
        if (map[prerequisites[i][1]]) {
            map[prerequisites[i][1]].push(prerequisites[i][0])
        } else {
            map[prerequisites[i][1]] = [prerequisites[i][0]]
        }
    }
    const queue = []
    for (let i = 0; i < inDegree.length; i++) {
        if (inDegree[i] === 0) {
            queue.push[i]
        }
    }
    console.log(inDegree, queue)
    const res = []
    while (queue.length) {
        const selected = queue.shift()
        res.push(selected)
        const toEnQueue = map[selected]
        if (toEnQueue && toEnQueue.length) {
            for (let i = 0; i < toEnQueue.length; i++) {
                inDegree[toEnQueue[i]]--
                if (inDegree[toEnQueue[i]] === 0) {
                    queue.push(toEnQueue[i])
                }
            }
        }
    }
    return res.length === numCourses ? res : []
}

findOrder(2, [[1, 0]])

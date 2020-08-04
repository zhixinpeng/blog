function allOrderOfString(str) {
    if (str.length <= 2) {
        return str.length === 2 ? [str, str[1] + str[0]] : [str]
    } else {
        return str
            .split('')
            .reduce(
                (cur, word, i) =>
                    cur.concat(
                        allOrderOfString(str.slice(0, i) + str.slice(i + 1)).map(
                            (val) => word + val
                        )
                    ),
                []
            )
    }
}

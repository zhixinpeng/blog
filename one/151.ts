function stringIndexOf(str: string, searchStr: string, fromIndex = 0) {
  const regex = new RegExp(searchStr, 'ig')
  regex.lastIndex = fromIndex
  const result = regex.exec(str)
  return result ? result.index : -1
}

console.log(stringIndexOf("sdfabdssf", "ab", 1))
function convert(source, parentId = 0) {
  const trees = []
  for (let item of source) {
    if (item.parentId === parentId) {
      let children = convert(source, item.id)
      if (children.length) {
        item.children = children
      }
      trees.push(item)
    }
  }
  return trees
}

let list = [
  { id: 1, name: '部门A', parentId: 0 },
  { id: 2, name: '部门B', parentId: 0 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 4, name: '部门D', parentId: 1 },
  { id: 5, name: '部门E', parentId: 2 },
  { id: 6, name: '部门F', parentId: 3 },
  { id: 7, name: '部门G', parentId: 2 },
  { id: 8, name: '部门H', parentId: 4 },
]

console.log(convert(list))
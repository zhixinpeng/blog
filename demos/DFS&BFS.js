// 深度优先遍历（DFS: depth-first-search）：从顶点出发，依次遍历完各个分支，在一个分支所有节点都被访问之后进入到下一个分支的点击访问
const traversal1 = (node, nodeList = []) => {
  if (node !== null) {
    nodeList.push(node);
    const children = node.children;
    for (let i = 0; i < children.length; i++) {
      traversal1(children[i], nodeList);
    }
  }
  return nodeList;
};

const traversal2 = node => {
  const nodes = [];
  if (node !== null) {
    nodes.push(node);
    const children = node.children;
    for (let i = 0; i < children.length; i++) {
      nodes = nodes.concat(traversal2(children[i]));
    }
  }
  return nodes;
};

const traversal3 = node => {
  const stack = [];
  const nodes = [];
  if (node) {
    stack.push(node);
    while (stack.length) {
      const item = stack.pop();
      const children = item.children;
      nodes.push(item);
      // node = [] stack = [parent]
      // node = [parent] stack = [child3,child2,child1]
      // node = [parent, child1] stack = [child3,child2,child1-2,child1-1]
      // node = [parent,child1, child1-1] stack = [child3,child2,child1-2]
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i]);
      }
    }
  }
  return nodes;
};

// 广度优先遍历（BFS: breadth-first-search）：从顶点出发，按照层级访问该层级所有分支之后，进入下一个层级的分支访问，直到这个分支没有下一层级可以访问
const traversal4 = node => {
  const stack = [];
  const nodes = [];
  if (node) {
    stack.push(node);
    while (stack.length) {
      const item = stack.shift();
      const children = item.children;
      nodes.push(item);
      // 队列，先进先出
      // nodes = [] stack = [parent]
      // nodes = [parent] stack = [child1,child2,child3]
      // nodes = [parent, child1] stack = [child2,child3,child1-1,child1-2]
      // nodes = [parent,child1,child2]
      for (let i = 0; i < children.length; i++) {
        stack.push(children[i]);
      }
    }
  }
  return nodes;
};

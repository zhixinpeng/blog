interface Result {
  value?: string,
  children?: Result
}

const normalize = (str: string) => {
  let result: Result = {}
  str.split(/[\[\]]/g).filter(Boolean).reduce((obj: Result, item: string, index: number, a: string[]) => {
    console.log(obj, item, index, a)
    obj.value = item
    if (index !== a.length - 1) {
      return (obj.children = {})
    }
    return obj
  }, result)
  return result
}

console.log(normalize('[abc[bcd[def]]]'))
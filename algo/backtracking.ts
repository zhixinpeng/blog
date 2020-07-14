const result: number[] = []

function calc8queens(row: number) {
  if (row === 8) {
    console.log(result)
    return
  }
  for (let column = 0; column < 8; column++) {
    if (isOk(row, column)) {
      result[row] = column
      calc8queens(row + 1)
    }
  }
}

function isOk(row: number, column: number): boolean {
  let leftup = column - 1, rightup = column + 1
  for (let i = row - 1; i >= 0; --i) {
    if (result[i] === column) return false
    if (leftup >= 0) {
      if (result[i] === leftup) return false
    }
    if (rightup < 8) {
      if (result[i] === rightup) return false
    }
    --leftup, ++rightup
  }
  return true
}

calc8queens(0)
function sumPositiveNumbers(numbers: number[]) {
  return numbers.reduce((prev, curr, _) => {
    if(curr > 0) {
      return prev + curr;
    }
    return prev
  }, 0)
}

function consolePositiveNumber(x: number) {
  console.log(`${x} is a positive number`)
}

function process2(numbers: number[]) {

  const total = sumPositiveNumbers(numbers);

  numbers.filter(number => number > 0).forEach(consolePositiveNumber)

  return total
}

var numbers = [1,-2,3,-4,5,-25,30];

var result = process2(numbers);

console.log('Total:', result)
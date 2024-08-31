```
function process1(items: any) {

  var total = 0;

  for(var i = 0; i < items.length; i++) {
    if(items[i] > 0) {
      total = total + items[i]
    }
  }

  for(var j = 0; j < items.length; j++) {
    console.log(items[j] + ' is a positive number');
  }

  return total
}
```

## Code Review

### Primeiro trecho
O primeiro trecho de código é funcional, porém pode ser separado em uma nova função pra dar contexto.
Não é necessário usar "reduce", mas "reduce" já pressupõe que algo será acumulado e somado, o que pode ajudar quem lê o código
De...
```
  var total = 0;

  for(var i = 0; i < items.length; i++) {
    if(items[i] > 0) {
      total = total + items[i]
    }
  }

```
Para...
```
function sumPositiveNumbers(numbers: number[]) {
  return numbers.reduce((prev, curr, _) => {
    if(curr > 0) {
      return prev + curr;
    }
    return prev
  }, 0)
}

function process(numbers: number[]) {

  const total = sumPositiveNumbers(numbers);

  ...código...
}
```

### Segundo trecho
O segundo trecho parece não funcionar corretamente para printar os números positivos.
Poderia-se também usar recursos funcionais para melhorar a leitura e abstração em outra função para remover o que não é foco
De...
```
  for(var j = 0; j < items.length; j++) {
    console.log(items[j] + ' is a positive number');
  }

  return total
```

Para...
```
function consolePositiveNumber(x: number) {
  console.log(`${x} is a positive number`)
}

function process(numbers: number[]) {

  .... código ....

  numbers.filter(number => number > 0).forEach(consolePositiveNumber)

  return total
}
```

## Resultado

```
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

function process(numbers: number[]) {

  const total = sumPositiveNumbers(numbers);

  numbers.filter(number => number > 0).forEach(consolePositiveNumber)

  return total
}

var numbers = [1,-2,3,-4,5];

var result = process(numbers);

console.log('Total:', result)
```
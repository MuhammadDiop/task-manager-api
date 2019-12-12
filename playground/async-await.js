const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(a < 0 || b < 0) reject('No negative.')
      resolve(a + b)
    }, 2000)
  })
}

const doWork = async () => {
  const sum = await add(1, 99)
  const sum2 = await add(sum, 1)
  const sum3 = await add(sum, 7)
  return sum3
}

doWork()
  .then(result => console.log(result))
  .catch(error => console.log(error))

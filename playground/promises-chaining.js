const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b)
    }, 2000)
  })
}

//First Method
add(1,2)
  .then(result =>

    add(result, 5)
      .then(res => console.log(res))
      .catch(error => console.log(error))

  )
  .catch(error => console.log(error))


//Second Method
add(1,2)
  .then(result => add(result, 5))
  .then(result => console.log(result))
  .catch(error => console.log(error))

const jwt = require('jsonwebtoken')

const myFunc = async () => {
  const secret = process.env.secret || 'secret'
  const token = await jwt.sign({_id: 'abc123'}, secret, {expiresIn: '1 day'})
  console.log(token)

  const data = await jwt.verify(token, secret)
  console.log(data)
}

myFunc()

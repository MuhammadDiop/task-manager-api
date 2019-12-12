require('../src/db/mongoose')
const User = require('../src/models/user')

User.findOneAndUpdate({age: 1}, { $inc: { age: 4 } })
  .then(result => User.countDocuments({age: 1}))
  .then(result => console.log(result))
  .catch(error => console.log(error))


const updateAgeAndCount = async (age) => {
  const user = await User.findOneAndUpdate({age}, { $inc: { age: 4 } })
  const count = await User.countDocuments({age})
  return count
}

updateAgeAndCount(1)
  .then(result => console.log(result))
  .catch(error => console.log(erro))

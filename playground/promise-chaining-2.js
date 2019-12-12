require('../src/db/mongoose')
const mongoose = require('mongoose')
const Task = require('../src/models/task')

Task.findOneAndDelete({completed: false})
  .then(result => Task.countDocuments({completed: false}))
  .then(result => console.log(result))
  .catch(error => console.log(error))

const findTaskAndDelete = async (completed) => {
  const task = await Task.findOneAndDelete({completed})
  const count = await Task.countDocuments({completed})
  return count
}

findTaskAndDelete(false)
  .then(result => console.log(result))
  .catch(error => console.log(error))

const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
  const task = await Task.findById('5de9382e4c32c01f8ae7e0e1')
  await task.populate('owner').execPopulate()
  console.log(task.owner)
  const user = await User.findById('5de9373b3b7ca31a57f49dd4')
  await user.populate('tasks').execPopulate()
  console.log(user.tasks)
}

main()

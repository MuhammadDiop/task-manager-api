const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()

// console.log(id.id.length)
// console.log(id.toHexString().length)
// console.log(id.getTimestamp())
MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database')
  }

  const db = client.db(databaseName)
  const tasks = db.collection('tasks')
  const users = db.collection('users')
  // const cursor = users.find({age: 21})
  // cursor.count((error, count) => {
  //   console.log(count)
  // })

  const deletePromise = tasks.deleteOne({description: 'do dishes.'})

  deletePromise
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      console.log(error)
    })

  // const updatePromise = tasks.updateMany({completed: false}, {$set: {completed: true}})
  //
  // updatePromise
  //   .then((result) => {
  //     console.log(result)
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   })

  // tasks.findOne({_id: new ObjectID('5de027d1143ed75d418b4353')}, (error, task) => {
  //   if(error) {
  //     return console.log(error)
  //   }
  //   console.log(task)
  // })
  // tasks.find({completed: false}).toArray((error, tasks) => {
  //   if(error) {
  //     return console.log(error)
  //   }
  //   console.log(tasks)
  // })
  //
  // // tasks.insertMany([
  // //   {
  // //     description: 'do groceries',
  // //     completed: false
  // //   },
  // //   {
  // //     description: 'do dishes.',
  // //     completed: true
  // //   },
  // //   {
  // //     description: 'walk dog.',
  // //     completed: true
  // //   }
  // // ], (error, result) => {
  // //     if(error) {
  // //       return console.log(error)
  // //     }
  // //     console.log(result.ops)
  // //   }
  // // )
  // users.insertOne({
  //   id,
  //   name: 'Vikram',
  //   age: 26
  // }, (error, result) => {
  //   if(error) {
  //     return console.log(error)
  //   }
  //   console.log(result.ops)
  // })
  // // users.insertMany([{
  // //   name: 'Andrew',
  // //   age: 21
  // // }, {
  // //   name: 'Gunther',
  // //   age: 22
  // // }], (error, result) => {
  // //   if(error) {
  // //     return console.log(error)
  // //   }
  // //   console.log(result.ops)
  // // })

})

//for mongoose ====>

//const task = await Task.findOneAndUpdate({_id}, req.body, {new: true, runValidators: true})

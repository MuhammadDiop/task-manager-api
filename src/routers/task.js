const express = require('express')
const router = new express.Router()
const auth = require('../middlewares/auth')
const Task = require('../models/task')

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.currentUser._id
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch(error) {
    res.status(400).send({error: 'Bad Request.'})
  }
})

//get /tasks?completed=true
router.get('/tasks', auth, async (req, res) => {
  const match = {}

  if(req.query.completed) match.completed = req.query.completed

  const options = {}

  if(req.query.limit) options.limit = parseInt(req.query.limit)

  if(req.query.skip) options.skip = parseInt(req.query.skip)

  if(req.query.sortBy) {
    options.sort = {}
    options.sort[req.query.sortBy.split(':')[0]] = parseInt(req.query.sortBy.split(':')[1])
  }

  try {
    await req.currentUser.populate({
      path: 'tasks',
      match,
      options
    }).execPopulate()
    res.send(req.currentUser.tasks)
  } catch(error) {
    res.status(500).send({error: 'Server Error.'})
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOne({ _id, owner: req.currentUser._id })
    if(!task) return res.status(404).send({error: 'Not Found.'})
    res.send(task)
  } catch(error) {
    res.status(500).send({error: 'Server Error.'})
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  const allowedUpdates = ['description', 'completed']
  const updates = Object.keys(req.body)
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if(!isValidOperation) {
    return res.status(400).send({error: 'Invalid Updates.'})
  }

  try {
    const task = await Task.findOne({_id, owner: req.currentUser._id})
    if(!task) return res.status(404).send({error: 'Not Found.'})
    updates.forEach(update => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch(error) {
    res.status(500).send({error: 'Server Error.'})
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOneAndDelete({_id, owner: req.currentUser._id})
    if(!task) return res.status(404).send({error: 'Not Found.'})
    res.send(task)
  } catch(error) {
    res.status(500).send({error: 'Server Error.'})
  }
})

module.exports = router

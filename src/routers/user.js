const express = require('express')
const sharp = require('sharp')
const router = new express.Router()
const auth = require('../middlewares/auth')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const User = require('../models/user')

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    const token = await user.generateAuthToken()
    await sendWelcomeEmail(user.email, user.name)
    res.status(201).send({ user, token })
  } catch(error) {
    res.status(400).send({error: 'SignUp Error.', message: 'Email is already taken.'})
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.logIn(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({ user, token })
  } catch(error) {
    res.status(400).send({error: 'Login Error.'})
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.currentUser.tokens = req.currentUser.tokens.filter(doc => {
      doc.token !== req.token
    })
    await req.currentUser.save()
    res.send({message: 'Succesfully logged out.'})
  } catch(error) {
    res.status(500).send({error: 'Server Error.'})
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.currentUser.tokens = []
    await req.currentUser.save()
    res.send({message: 'Succesfully logged out.'})
  } catch(error) {
    res.status(500).send({error: 'Server Error.'})
  }
})

router.get('/users/me', auth, async (req, res) => {
  res.send({ user: req.currentUser })
})

router.patch('/users/me', auth, async (req, res) => {
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const updates = Object.keys(req.body)
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if(!isValidOperation) {
    return res.status(400).send({error: 'Invalid Updates.'})
  }

  try {
    updates.forEach(update => req.currentUser[update] = req.body[update])
    await req.currentUser.save()
    res.send({ user })
  } catch(error) {
    res.status(400).send({error: 'Bad Request.'})
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.currentUser.remove()
    await sendCancelEmail(req.currentUser.email, req.currentUser.name)
    res.send({ user: req.currentUser })
  } catch(error) {
    res.status(500).send({error: 'Server Error.'})
  }
})

const upload = require('multer')({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('File must be either jpg, jpeg or png'))
    }
    cb(undefined, true)
  }
})

router.post('/users/me/avatar', upload.single('avatar'), auth, async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.currentUser.avatar = buffer
  await req.currentUser.save()
  res.send({ message: 'successfully uploaded.' })
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.currentUser.avatar = undefined
  await req.currentUser.save()
  res.send({ message: 'successfully deleted.' })
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if(!user) throw new Error('Not Found.')
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch(error) {
    res.status(404).send({ error: error.message })
  }
})

module.exports = router

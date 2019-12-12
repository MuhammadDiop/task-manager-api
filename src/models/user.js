const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    default: 0,
    validate(value) {
      if(value < 0) throw new Error('age must be positive')
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is not valid')
      }
    }
  },
  password: {
    type: String,
    minlength: 6,
    trim: true,
    validate(value) {
      if(value.includes('password')) throw new Error('You used the word password in your password.')
    }
  },
  avatar: {
    type: Buffer
  },
  tokens: [{
    token: {
      type: String,
      required: true
    },
  }]
}, {
  timestamps: true
})

//virtual field
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

//Hash the plain text password without saving
userSchema.pre('save', async function(next) {
  const user = this

  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

//Delete user tasks - cascade delete
userSchema.pre('remove', async function(next) {
  const user = this

  await Task.deleteMany({ owner: user._id })

  next()
})

//get back public profile
userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

//create auth Token
userSchema.methods.generateAuthToken = async function() {
  const user = this
  const secret = process.env.SECRET || 'secretbitch'
  const token = await jwt.sign({_id: this._id}, secret)
  user.tokens.push({ token })
  await user.save()
  return token
}

//create model method
userSchema.statics.logIn = async function (email, password) {
  const user = await this.findOne({ email })
  if(!user) throw new Error('Login Error.')
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) throw new Error('Login Error.')
  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User

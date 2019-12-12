const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try{
    const secret = process.env.SECRET || 'secretbitch'
    const token = req.headers.authorization.replace('Bearer ', '')
    const payload = await jwt.verify(token, secret)
    const user = await User.findOne({_id: payload._id, 'tokens.token': token})
    if(!user) throw new Error()
    req.token = token
    req.currentUser = user
    next()
  } catch(error) {
    res.status(401).send({ error: 'Unauthorized.' })
  }
}

module.exports = auth

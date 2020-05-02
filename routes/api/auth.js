const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

// @route     GET api/auth
// @desc      Test route
// @access    Public
router.get('/', auth, async (request, response) => {

 try {
  const user = await User.findById(request.user.id).select('-password')
  response.json(user)
 } catch (error) {
  console.error(error.message)
  response.status(500).json({ message: 'Internal server error' })
 }
})

// @route     POST api/auth
// @desc      Authenticate user and get token
// @access    Public
router.post('/', [
 check('email', 'Please enter a valid email').isEmail(),
 check('password', 'Password is required').exists()
], async (request, response) => {
 const errors = validationResult(request)
 if (!errors.isEmpty()) {
  return response.status(400).json({ errors: errors.array() })
 }
 const { email, password } = request.body

 try {
  // See if use exists
  let user = await User.findOne({ email })
  if (!user) {
   return response
    .status(400)
    .json({ errors: [{ message: 'Invalid credentials' }] })
  }

  // Check if there is a match
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
   return response
    .status(400)
    .json({ errors: [{ message: 'Invalid credentials' }] })
  }

  // Get payload
  const payload = {
   user: {
    id: user.id
   }
  }

  // Return jsonwebtoken
  jwt.sign(
   payload,
   config.get('jwtSecret'),
   { expiresIn: 360000 },
   (error, token) => {
    if (error) throw error
    response.json({ token })
   })
 } catch (error) {
  response.status(500).send('Internal server error')
  console.error(error.message)
 }
})

module.exports = router
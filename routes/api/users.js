const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')

// @route     POST api/users
// @desc      Register user
// @access    Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Enter a password with 6 or more characters')
    .isLength({ min: 6 })
], async (request, response) => {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() })
  }
  const { name, email, password } = request.body

  try {
    // See if use exists
    let user = await User.findOne({ email })
    if (user) {
      return response
        .status(400)
        .json({ errors: [{ message: 'User already exists' }] })
    }

    // Get user gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })
    // Create user
    user = new User({ name, email, avatar, password })

    // Encrypt password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Save user
    await user.save();

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

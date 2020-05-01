const express = require('express')
const router = express.Router()

// @route     GET api/users
// @desc      Test route
// @access    Public
router.get('/', (request, response) => {
 response.send('Posts route')
})

module.exports = router
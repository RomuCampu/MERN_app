const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')
const Post = require('../../models/Post')

// @route     POST api/posts
// @desc      Add new post 
// @access    Private
router.post('/', [auth, [
 check('text', 'Text is required').not().isEmpty()
]],
 async (request, response) => {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
   return response.status(400).json({ errors: errors.array() })
  }

  try {
   const user = await User.findById(request.user.id).select('-password')
   const newPost = new Post({
    text: request.body.text,
    name: user.name,
    avatar: user.avatar,
    user: request.user.id
   })

   const post = await newPost.save()

   response.json(post)

  } catch (error) {
   console.error(error.message)
   response.status(500).send({ error: 'Internal server error' })
  }
 })

// @route     GET api/posts
// @desc      Get all posts
// @access    Private

router.get('/', auth, async (request, response) => {
 try {
  const posts = await Post.find().sort({ date: -1 })
  response.json(posts)
 } catch (error) {
  console.error(error.message)
  response.status(500).send('Internal serve error')
 }
})

// @route     GET api/posts/:id
// @desc      Get a post by id
// @access    Private

router.get('/:id', auth, async (request, response) => {
 try {
  const post = await Post.findById(request.params.id)
  if (!post) {
   return response.status(404).json({ message: 'post not found' })
  }
  response.json(post)
 } catch (error) {
  console.error(error.message)
  if (error.kind = 'ObjectId') {
   return response.status(404).json({ message: 'post not found' })
  }
  response.status(500).send('Internal server error')
 }
})

// @route     DELETE api/posts/:id
// @desc      Delete a post by id
// @access    Private

router.delete('/:id', auth, async (request, response) => {
 try {
  const post = await Post.findById(request.params.id)
  // Check if post exist
  if (!post) {
   return response.status(404).json({ message: 'Post not found' })
  }

  // Check if user is owner
  if (post.user.toString() !== request.user.id) {
   return response.status(401).json({ message: 'User not authorized' })
  } else {
   await post.remove()
   response.json({ message: 'Post removed' })
  }

  // response.json(post)
 } catch (error) {
  console.error(error.message)
  if (error.kind = 'ObjectId') {
   return response.status(404).json({ message: 'Post not found' })
  }
  response.status(500).send('Internal server error')
 }
})

// @route     PUST api/posts/like/:id
// @desc      Like a post by id
// @access    Private

router.put('/like/:id', auth, async (request, response) => {
 console.log('entered')
 try {
  const post = await Post.findById(request.params.id)

  console.log(post.likes)
  // Check if user already liked the post
  if (post.likes.filter(like => like.user.toString() === request.user.id).length > 0) {
   return response.status(400).json({ message: 'Post already liked' })
  } else {
   post.likes.unshift({ user: request.user.id })
  }

  await post.save()

  response.json(post.likes)


 } catch (error) {
  console.error(error.message)
  response.status(500).json('Internal server error')
 }
})

// @route     PUST api/posts/like/:id
// @desc      Like a post by id
// @access    Private

router.put('/unlike/:id', auth, async (request, response) => {
 console.log('entered')
 try {
  const post = await Post.findById(request.params.id)

  // Check if user already liked the post
  if (post.likes.filter(like => like.user.toString() === request.user.id).length === 0) {
   return response.status(400).json({ message: 'Post has not yet been liked' })
  }

  // Get index to remove
  const removeIndex = post.likes
   .map(like => like.user.toString())
   .indexOf(request.user.id)

  post.likes.splice(removeIndex, 1)

  await post.save()

  response.json(post.likes)

 } catch (error) {
  console.error(error.message)
  response.status(500).json('Internal server error')
 }
})

// @route     POST api/comment/:id
// @desc      Add new comment on a post
// @access    Private
router.post('/comment/:id', [auth, [
 check('text', 'Text is required').not().isEmpty()
]],
 async (request, response) => {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
   return response.status(400).json({ errors: errors.array() })
  }

  try {
   const user = await User.findById(request.user.id).select('-password')
   const post = await Post.findById(request.params.id)

   const newComment = {
    text: request.body.text,
    name: user.name,
    avatar: user.avatar,
    user: request.user.id
   }


   post.comments.unshift(newComment)

   await post.save()

   response.json(post.comments)

  } catch (error) {
   console.error(error.message)
   response.status(500).send({ error: 'Internal server error' })
  }
 })

// @route     POST api/comment/:id/:comment_id
// @desc      Add new comment on a post
// @access    Private

router.delete('/comment/:id/:comment_id', auth, async (request, response) => {

 try {
  const post = await Post.findById(request.params.id)
  console.log(post)
  // Pull out comment
  const comment = post.comments.find(comment => comment.id === request.params.comment_id)

  // Make sure comment exists
  if (!comment) {
   return response.status(404).json({ error: 'Comment does not exist' })
  }

  // Make sure user is the one who made the comment
  if (comment.user.toString() !== request.user.id) {
   return response.status(401).json({ error: 'User not authorized' })
  }


  const removeIndex = post.comments
   .map(comment => comment.user.toString())
   .indexOf(request.user.id)


  post.comments.splice(removeIndex, 1)

  await post.save()

  response.json(post.comments)

 } catch (error) {
  console.error(error.message)
  response.status(500).json({ message: 'Internal server error' })
 }
})

module.exports = router
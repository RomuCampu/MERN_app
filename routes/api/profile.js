const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const request = require('request')
const config = require('config')
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route     GET api/profile/me
// @desc      GET current users profile
// @access    Private

router.get('/me', auth, async (request, response) => {
 try {
  const profile = await Profile
   .findOne({ user: request.user.id })
   .populate('user', ['name', 'avatar'])
  if (!profile) {
   return response.status(400).json({ message: 'There is no profile for this user' })
  }
  response.send(profile)
 } catch (error) {
  response.status(500).send('Internal Server error')
 }
})

// @route     POST api/profile/
// @desc      CREATE or UPDATE users profile
// @access    Private

router.post('/', [auth, [
 check('status', 'Status is required').not().isEmpty(),
 check('skills', 'Skills is required').not().isEmpty()
]], async (request, response) => {

 const errors = validationResult(request)
 if (!errors.isEmpty()) {
  return response.status(400).json({ errors: errors.array() })
 }

 const {
  company, website, location, bio, status, githubusername,
  skills, youtube, facebook, twitter, instagram, linkedin
 } = request.body

 // Build profile object
 const profileFields = {}
 profileFields.user = request.user.id
 if (company) profileFields.company = company
 if (website) profileFields.website = website
 if (location) profileFields.location = location
 // if (experience) profileFields.experience = experience
 // if (education) profileFields.education = education
 if (bio) profileFields.bio = bio
 if (status) profileFields.status = status
 if (githubusername) profileFields.githubusername = githubusername

 if (skills) {
  profileFields.skills = skills.split(',').map(skill => skill.trim())
 }
 // build social object 
 profileFields.social = {}
 if (youtube) profileFields.social.youtube = youtube
 if (facebook) profileFields.social.facebook = facebook
 if (twitter) profileFields.social.twitter = twitter
 if (instagram) profileFields.social.instagram = instagram
 if (linkedin) profileFields.social.linkedin = linkedin

 try {
  let profile = await Profile.findOne({ user: request.user.id })
  if (profile) {
   // Update
   profile = await Profile.findOneAndUpdate(
    { user: request.user.id },
    { $set: profileFields },
    { new: true })
   return response.json(profile)
  }
  // Create 
  profile = new Profile(profileFields)

  await profile.save()
  response.json(profile)
 } catch (error) {
  console.error(error.message)
  response.status(500).send('Internal server error')
 }
})

// @route     GET api/profile/
// @desc      GET all profiles
// @access    Public

router.get('/', async (request, response) => {
 try {
  let profiles = await Profile.find({}).populate('user', ['name', 'avatar'])
  response.json(profiles)
 } catch (error) {
  console.error(error.message)
  response.status(500).send('Internal server error')
 }
})

// @route     GET api/profile/user/:user_id
// @desc      GET one profile by user id
// @access    Public

router.get('/user/:user_id', async (request, response) => {

 try {
  let profile = await Profile.findOne({ user: request.params.user_id }).populate('user', ['name', 'avatar'])
  if (!profile) {
   return response.status(400).json({ message: 'Profile not found' })
  }
  response.json(profile)
 } catch (error) {
  console.error(error.message)
  if (error.kind === 'ObjectId') {
   return response.status(400).json({ message: 'Profile not found' })
  }
  response.status(500).send('Internal server error')
 }
})

// @route     DELETE api/profile/
// @desc      DELETE profile user and post
// @access    Private

router.delete('/user/:user_id', auth, async (request, response) => {
 try {

  // Remove profile
  await Profile.findOneAndRemove({ user: request.user.id })
  // Remove user
  await User.findOneAndRemove({ _id: request.user.id })

  response.json('Profile deleted successfully')
 } catch (error) {
  console.error(error.message)
  if (error.kind === 'ObjectId') {
   return response.status(400).json({ message: 'Profile not found' })
  }
  response.status(500).send('Internal server error')
 }
})

// @route     PUT api/profile/experience
// @desc      Add profile experience
// @access    Private

router.put('/experience', [auth, [
 check('title', 'Title is required').not().isEmpty(),
 check('company', 'Company is required').not().isEmpty(),
 check('from', 'Date is required').not().isEmpty()
]], async (request, response) => {

 const errors = validationResult(request)
 if (!errors.isEmpty()) {
  return response.status(400).json({ errors: errors.array() })
 }

 const { title, company, location, from, to, current, description } = request.body

 const newExp = {
  title,
  company,
  location,
  from,
  to,
  current,
  description
 }
 try {

  const profile = await Profile.findOneAndUpdate({ user: request.user.id })

  profile.experience.push(newExp)

  await profile.save()

  response.json(profile)
 } catch (error) {
  console.error(error.message)
  response.status(500).send('Internal server error')
 }
})

// @route     DELETE api/profile/experience/:exp_id
// @desc      Remove profile experience
// @access    Private

router.delete('/experience/:exp_id', auth, async (request, response) => {

 try {
  const profile = await Profile.findOne({ user: request.user.id })

  // Get index of the item to remove
  const indexToRemove = profile.experience
   .map(item => item.id)
   .indexOf(request.params.exp_id)

  profile.experience.splice(indexToRemove, 1)

  await profile.save()
  response.json(profile)
 } catch (error) {
  console.error(error.message)
  response.status(500).send('Internal server error')
 }
})

// @route     PUT api/profile/education
// @desc      Add profile education
// @access    Private

router.put('/education', [auth, [
 check('school', 'School is required').not().isEmpty(),
 check('degree', 'Degree is required').not().isEmpty(),
 check('fieldofstudy', 'Field of study is required').not().isEmpty(),
 check('from', 'Date is required').not().isEmpty()
]], async (request, response) => {

 console.log('in the body')
 const errors = validationResult(request)
 if (!errors.isEmpty()) {
  return response.status(400).json({ errors: errors.array() })
 }

 console.log('after errors')


 const { school, degree, location, from, to, fieldofstudy, current, description } = request.body

 const newEdu = {
  school,
  degree,
  location,
  from,
  to,
  fieldofstudy,
  current,
  description
 }
 try {

  const profile = await Profile.findOne({ user: request.user.id })

  profile.education.concat(newEdu)
  await profile.save()
  response.json(profile)
 } catch (error) {
  response.status(500).send('Internal server error')
 }
})

// @route     DELETE api/profile/education/:edu_id
// @desc      Remove profile education
// @access    Private

router.delete('/education/:edu_id', auth, async (request, response) => {

 try {
  const profile = await Profile.findOne({ user: request.user.id })

  // Get index of the item to remove
  const indexToRemove = profile.education
   .map(item => item.id)
   .indexOf(request.params.edu_id)

  profile.education.splice(indexToRemove, 1)

  await profile.save()
  response.json(profile)
 } catch (error) {
  console.error(error.message)
  response.status(500).send('Internal server error')
 }
})

// @route     GET api/profile/github/:username
// @desc      Get user repos from github
// @access    Public

router.get('/github/:username', async (req, res) => {

 try {
  const options = {
   uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
   method: 'GET',
   headers: { 'user-agent': 'node.js' }
  }

  request(options, (error, response, body) => {
   if (error) console.error(error.message)

   if (response.statusCode !== 200) {
    return res.status(400).json({ message: 'No github profile found' })
   }

   res.json(JSON.parse(body))
  })
 } catch (error) {
  console.log(error.message)
  res.status(500).json({ error: 'Internal server error' })
 }

})

module.exports = router
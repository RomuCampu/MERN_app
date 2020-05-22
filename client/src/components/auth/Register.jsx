import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'


import InputField from './InputField'
import CustomButton from '../layout/CustomButton'

const Register = ({ setAlert, register, isAuthenticated }) => {
 const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  password2: ''
 })

 const { name, email, password, password2 } = formData

 const handleChange = (event) => setFormData(
  { ...formData, [event.target.name]: event.target.value }
 )

 const onFormSubmit = async (event) => {
  event.preventDefault()

  if (password !== password2) {
   setAlert('Passwords do not math', 'danger');
  } else {
   register({ name, email, password })
  }
 }

 if (isAuthenticated) {
  return <Redirect to='/dashboard' />
 }

 return (
  <React.Fragment>
   <section className="container">
    <h1 className="large text-primary">Sign Up</h1>
    <p className="lead"><i className="fas fa-user"></i> Create Your Account
    </p>
    <form className="form" onSubmit={event => onFormSubmit(event)}>
     <InputField
      type="text"
      placeholder="Name"
      name="name"
      value={name}
      onChange={event => handleChange(event)}
     // required
     />
     <InputField
      type="email"
      placeholder="Email Address"
      name="email"
      value={email}
      onChange={event => handleChange(event)}
      smallText='This site uses Gravatar so if you want a profile image, use a
      Gravatar email'
     // required
     />
     <InputField
      type="password"
      placeholder="Password"
      name="password"
      minLength="6"
      value={password}
      onChange={event => handleChange(event)}
     // minLength='6'
     // required
     />
     <InputField
      type="password"
      placeholder="Confirm Password"
      name="password2"
      minLength="6"
      value={password2}
      onChange={event => handleChange(event)}
     // minLength='6'
     // required
     />
     <CustomButton>
      Register
     </CustomButton>
     {/* <InputField
      type="submit"
      className="btn btn-primary"
      value="Register"
     /> */}
    </form>
    <p className="my-1">
     Already have an account? <Link to="/login">Sign In</Link>
    </p>
   </section>
  </React.Fragment>
 )
}

Register.propTypes = {
 setAlert: PropTypes.func.isRequired,
 register: PropTypes.func.isRequired,
 isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
 isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {
 setAlert, register
})(Register)

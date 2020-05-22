import React, { useState } from 'react'
import InputField from './InputField'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'
import CustomButton from '../layout/CustomButton'


const Login = ({ login, isAuthenticated }) => {
 const [formData, setFormData] = useState({
  email: '',
  password: ''
 })

 const { email, password } = formData

 const handleChange = (event) => setFormData(
  { ...formData, [event.target.name]: event.target.value }
 )

 const onFormSubmit = async (event) => {
  event.preventDefault()

  login(email, password)
 }

 if (isAuthenticated) {
  return <Redirect to='/dashboard' />
 }

 return (
  <React.Fragment>
   <section className="container">
    <h1 className="large text-primary">Sign In</h1>
    <p className="lead"><i className="fas fa-user"></i>
    Sing in to your account
    </p>
    <form className="form" onSubmit={event => onFormSubmit(event)}>
     <InputField
      type="email"
      placeholder="Email Address"
      name="email"
      value={email}
      onChange={event => handleChange(event)}
      required
     />
     <InputField
      type="password"
      placeholder="Password"
      name="password"
      label="password"
      value={password}
      onChange={event => handleChange(event)}
      required
     />
     {/* <InputField
      type="submit"
      className="btn btn-primary"
      value="Login"
     /> */}
     <CustomButton
      type='submit'
     >
      Login
     </CustomButton>
    </form>
    <p className="my-1">
     Don't have an account? <Link to="/register">Register</Link>
    </p>
   </section>
  </React.Fragment>
 )
}

Login.propTypes = {
 login: PropTypes.func.isRequired,
 isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
 isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login)

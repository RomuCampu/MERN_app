import React, { useState } from 'react'
import InputField from './InputField'
import { Link } from 'react-router-dom'

const Register = () => {
 const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  password2: ''
 })

 const handleChange = (event) => setFormData(
  { ...formData, [event.target.name]: event.target.value }
 )

 const onFormSubmit = async (event) => {
  event.preventDefault()

  if (password !== password2) {
   console.log('Passwords do not math');
  } else {
   console.log('success');

  }
 }

 const { name, email, password, password2 } = formData

 return (
  <React.Fragment>
   <section className="container">
    <h1 className="large text-primary">Sign Up</h1>
    <p className="lead"><i className="fas fa-user"></i> Create Your Account
    </p>
    <form className="form" onSubmit={onFormSubmit}>
     <InputField
      type="text"
      placeholder="Name"
      name="name"
      value={name}
      onChange={event => handleChange(event)}
      required
     />
     <InputField
      type="email"
      placeholder="Email Address"
      name="email"
      value={email}
      onChange={event => handleChange(event)}
      smallText='This site uses Gravatar so if you want a profile image, use a
      Gravatar email'
      required
     />
     <InputField
      type="password"
      placeholder="Password"
      name="password"
      minLength="6"
      value={password}
      onChange={event => handleChange(event)}
      required
     />
     <InputField
      type="password"
      placeholder="Confirm Password"
      name="password2"
      minLength="6"
      value={password2}
      onChange={event => handleChange(event)}
      required
     />
     <InputField
      type="submit"
      className="btn btn-primary"
      value="Register"
     />
    </form>
    <p className="my-1">
     Already have an account? <Link to="/login">Sign In</Link>
    </p>
   </section>
  </React.Fragment>
 )
}

export default Register

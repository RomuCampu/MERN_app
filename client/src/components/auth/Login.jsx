import React, { useState } from 'react'
import InputField from './InputField'
import { Link } from 'react-router-dom'

const Login = () => {
 const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: ''
 })

 const handleChange = (event) => setFormData(
  { ...formData, [event.target.name]: event.target.value }
 )

 const onFormSubmit = async (event) => {
  event.preventDefault()
  console.log('Success');
 }

 const { email, password } = formData

 return (
  <React.Fragment>
   <section className="container">
    <div className="alert alert-danger">
     Invalid credentials
     </div>
    <h1 className="large text-primary">Sign In</h1>
    <p className="lead"><i className="fas fa-user"></i>
    Singn in to your account
    </p>
    <form className="form" onSubmit={onFormSubmit}>
     <InputField
      type="email"
      placeholder="Email Address"
      name="name"
      value={email}
      onChange={event => handleChange(event)}
      required
     />
     <InputField
      type="email"
      placeholder="Email Address"
      name="Password"
      value={password}
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
     Don't have an account? <Link to="/register">Login</Link>
    </p>
   </section>
  </React.Fragment>
 )
}

export default Login

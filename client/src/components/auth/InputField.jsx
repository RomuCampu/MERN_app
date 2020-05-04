import React from 'react'

const InputField = ({ type, placeholder, name, value, onChange, smallText, className, required }) => {
 return (
  <React.Fragment>
   <div className="form-group">
    <input
     type={type}
     placeholder={placeholder}
     name={name}
     value={value}
     onChange={onChange}
     className={className}
     required={required}
    />
    <small className="form-text">
     {smallText}
    </small>
   </div>
  </React.Fragment>
 )
}

export default InputField
// import React from 'react'

// import '../../components/layout/styles/input-field.css'

// const InputField = ({ handleChange, label, ...otherProps }) => {
//  return (
//   <React.Fragment>
//    <div className="group">
//     <input
//      className="form-input"
//      onChange={handleChange}
//      {...otherProps}
//     />

//     {label
//      ? (<label className={`${
//       otherProps.value.length ? 'shrink' : ''} form-input-label`}
//      >
//       {label}
//      </label>)
//      : null
//     }
//    </div>
//   </React.Fragment>
//  )
// }

// export default InputField


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
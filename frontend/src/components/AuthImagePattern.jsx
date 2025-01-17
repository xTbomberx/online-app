import React from 'react'

// TAKES in 2 PROPS
function AuthImagePattern({ title, subtitle}) {
  return (
    <div className='auth-image-pattern'>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
    </div>
  )
}

export default AuthImagePattern
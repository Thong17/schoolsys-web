import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <NavLink to='/operation/class'>Class</NavLink>
      <NavLink to='/operation/attendance'>Attendance</NavLink>
    </>
  )
}

export default Navbar
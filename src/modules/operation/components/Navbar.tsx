import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <NavLink to='/operation/grade'>Grade</NavLink>
      <NavLink to='/operation/attendance'>Attendance</NavLink>
    </>
  )
}

export default Navbar
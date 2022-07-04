import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminNavbar = () => {
  return (
    <>
        <NavLink to='/school/student'>Student</NavLink>
        <NavLink to='/school/teacher'>Teacher</NavLink>
    </>
  )
}

export default AdminNavbar
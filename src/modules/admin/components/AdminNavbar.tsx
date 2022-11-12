import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminNavbar = () => {
  const { language } = useLanguage()
  return (
    <>
        <NavLink to='/admin/role'>{language['USER_ROLE']}</NavLink>
        <NavLink to='/admin/user'>{language['USER_LIST']}</NavLink>
    </>
  )
}

export default AdminNavbar
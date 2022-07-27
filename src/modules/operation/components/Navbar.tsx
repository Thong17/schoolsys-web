import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const { language } = useLanguage()
  return (
    <>
      <NavLink to='/operation/attendance'>{language['ATTENDANCE']}</NavLink>
    </>
  )
}

export default Navbar
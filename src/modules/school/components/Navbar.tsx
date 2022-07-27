import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const { language } = useLanguage()
  return (
    <>      
      <NavLink to='/school/class'>{language['CLASS']}</NavLink>
      <NavLink to='/school/grade'>{language['GRADE']}</NavLink>
      <NavLink to='/school/student'>{language['STUDENT']}</NavLink>
      <NavLink to='/school/teacher'>{language['TEACHER']}</NavLink>
    </>
  )
}

export default Navbar
import useLanguage from 'hooks/useLanguage'
import { NavLink } from 'react-router-dom'

const ReportNavbar = () => {
  const { language } = useLanguage()
  return (
    <>
      <NavLink to='/report/school'>{language['SCHOOL']}</NavLink>
      <NavLink to='/report/attendance'>{language['ATTENDANCE']}</NavLink>
    </>
  )
}

export default ReportNavbar
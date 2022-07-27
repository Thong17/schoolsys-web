import { NavLink } from 'react-router-dom'

const ReportNavbar = () => {
  return (
    <>
      <NavLink to='/report/school'>School</NavLink>
      <NavLink to='/report/attendance'>Attendance</NavLink>
    </>
  )
}

export default ReportNavbar
import { Layout } from 'components/layouts/Layout'
import ReportNavbar from './components/ReportNavbar'
import { useOutlet } from 'react-router'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const Report = () => {
  const outlet = useOutlet()
  const location = useLocation()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (location.pathname === '/report') navigate('/report/school')
  }, [location.pathname, navigate])
  
  return (
    <Layout navbar={<ReportNavbar />}>
      {outlet}
    </Layout>
  )
}

export { SchoolReport } from './SchoolReport'
export { AttendanceReport } from './AttendanceReport'
export { AttendanceDetail } from './AttendanceDetail'
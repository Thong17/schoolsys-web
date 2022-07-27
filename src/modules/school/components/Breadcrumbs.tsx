import Breadcrumb from 'components/shared/Breadcrumbs'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import { FC } from 'react'
import useLanguage from 'hooks/useLanguage'

declare type page = 'school' | 'student' | 'studentCreate' | 'studentUpdate' | 'teacher' | 'teacherCreate' | 'teacherUpdate' | 'grade' | 'gradeCreate' | 'gradeUpdate' | 'class' | 'classCreate' | 'classUpdate'

interface IAdminBreadcrumbs {
  page: page
}

const AdminBreadcrumbs: FC<IAdminBreadcrumbs> = ({ page }) => {
  const { language } = useLanguage()
  const stages = {
    school: [
      {
        title: language['SCHOOL'],
      },
    ],
    student: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['STUDENT'],
      },
    ],
    studentCreate: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['STUDENT'],
        path: '/school/student',
      },
      {
        title: language['CREATE'],
      },
    ],
    studentUpdate: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['STUDENT'],
        path: '/school/student',
      },
      {
        title: language['UPDATE'],
      },
    ],
    teacher: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['TEACHER'],
      },
    ],
    teacherCreate: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['TEACHER'],
        path: '/school/teacher',
      },
      {
        title: language['CREATE'],
      },
    ],
    teacherUpdate: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['TEACHER'],
        path: '/school/teacher',
      },
      {
        title: language['UPDATE'],
      },
    ],
    grade: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['GRADE'],
      },
    ],
    gradeCreate: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['GRADE'],
        path: '/school/grade',
      },
      {
        title: language['CREATE'],
      },
    ],
    gradeUpdate: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['GRADE'],
        path: '/school/grade',
      },
      {
        title: language['UPDATE'],
      },
    ],
    
    class: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['CLASS'],
      },
    ],
    classCreate: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['CLASS'],
        path: '/school/class',
      },
      {
        title: language['CREATE'],
      },
    ],
    classUpdate: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['CLASS'],
        path: '/school/class',
      },
      {
        title: language['UPDATE'],
      },
    ],
  }
  return <Breadcrumb stages={stages[page]} title={<HomeWorkRoundedIcon />} />
}

export default AdminBreadcrumbs

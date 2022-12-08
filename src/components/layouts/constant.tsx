import SettingsIcon from '@mui/icons-material/Settings'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
// import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'

export const sideNav = [
  // {
  //   route: '/operation',
  //   title: 'OPERATION',
  //   icon: <FactCheckRoundedIcon />,
  // },
  {
    route: '/report',
    title: 'REPORT',
    icon: <BarChartRoundedIcon />,
    permission: 'report',
    children: [
      // {
      //   route: '/report/school',
      //   title: 'School',
      //   icon: <ArrowRightAltRoundedIcon />,
      //   permission: 'school'
      // },
      {
        route: '/report/attendance',
        title: 'Attendance',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'attendance'
      },
      {
        route: '/report/academy',
        title: 'Academy',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'academy'
      },
    ]
  },
  {
    route: '/school',
    title: 'SCHOOL',
    icon: <HomeWorkRoundedIcon />,
    permission: 'school',
    children: [
      {
        route: '/school/attendance',
        title: 'Attendance',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'attendance'
      },
      {
        route: '/school/class',
        title: 'Class',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'class'
      },
      {
        route: '/school/grade',
        title: 'Grade',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'grade'
      },
      {
        route: '/school/student',
        title: 'Student',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'student'
      },
      {
        route: '/school/teacher',
        title: 'Teacher',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'teacher'
      },
    ]
  },
  {
    route: '/admin/user',
    title: 'User Management',
    icon: <AdminPanelSettingsIcon />,
    permission: 'admin'
  },
  {
    route: '/config',
    title: 'THEME',
    icon: <SettingsIcon />,
    permission: 'config'
  },
]

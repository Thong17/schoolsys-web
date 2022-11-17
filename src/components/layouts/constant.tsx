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
    children: [
      {
        route: '/report/school',
        title: 'School',
        icon: <ArrowRightAltRoundedIcon />,
      },
      {
        route: '/report/attendance',
        title: 'Attendance',
        icon: <ArrowRightAltRoundedIcon />,
      },
      {
        route: '/report/academy',
        title: 'Academy',
        icon: <ArrowRightAltRoundedIcon />,
      },
    ]
  },
  {
    route: '/school',
    title: 'SCHOOL',
    icon: <HomeWorkRoundedIcon />,
    children: [
      {
        route: '/school/attendance',
        title: 'Attendance',
        icon: <ArrowRightAltRoundedIcon />,
      },
      {
        route: '/school/class',
        title: 'Class',
        icon: <ArrowRightAltRoundedIcon />,
      },
      {
        route: '/school/grade',
        title: 'Grade',
        icon: <ArrowRightAltRoundedIcon />,
      },
      {
        route: '/school/student',
        title: 'Student',
        icon: <ArrowRightAltRoundedIcon />,
      },
      {
        route: '/school/teacher',
        title: 'Teacher',
        icon: <ArrowRightAltRoundedIcon />,
      },
    ]
  },
  {
    route: '/admin/user',
    title: 'USER',
    icon: <AdminPanelSettingsIcon />,
  },
  {
    route: '/config',
    title: 'THEME',
    icon: <SettingsIcon />,
  },
]

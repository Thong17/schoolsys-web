import SettingsIcon from '@mui/icons-material/Settings'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'

export const sideNav = [
  {
    route: '/operation',
    title: 'OPERATION',
    icon: <FactCheckRoundedIcon />,
  },
  {
    route: '/school',
    title: 'SCHOOL',
    icon: <HomeWorkRoundedIcon />,
    children: [
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
    route: '/admin',
    title: 'ADMIN',
    icon: <AdminPanelSettingsIcon />,
    permission: 'admin'
  },
  {
    route: '/report',
    title: 'REPORT',
    icon: <BarChartRoundedIcon />,
  },
  {
    route: '/config',
    title: 'CONFIG',
    icon: <SettingsIcon />,
  },
]

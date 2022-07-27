import { RouteObject } from 'react-router'
import AuthGuard from '../auth/AuthGuard'
import { Login } from 'modules/auth/Login'
// import { Register } from 'modules/auth/Register'
import { Admin, Roles, CreateRole, UpdateRole, DetailRole, Users, CreateUser, UpdateUser, DetailUser } from 'modules/admin'
import { SchoolReport, AttendanceReport, AttendanceDetail, Report } from 'modules/report'
import { Counter } from 'modules/counter/Counter'
import Config from 'modules/config/Config'
import NotFound from 'components/shared/NotFound'
import { CreateStudent, CreateTeacher, DetailStudent, DetailTeacher, School, Students, Teachers, UpdateStudent, UpdateTeacher, DetailFormStudent, UpdateGrade, Grades, DetailGrade, CreateGrade, SubjectGrade, Classes, CreateClass, UpdateClass, DetailClass, StudentClass } from 'modules/school'
import { Operation, Classes as AttendanceClasses, Attendances, AttendanceStudent, AttendanceTeacher } from 'modules/operation'

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Counter />
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  // Enable for Development only
  // {
  //   path: '/register',
  //   element: <Register />,
  // },
  {
    path: '/admin',
    element: (<Admin />),
    children: [
      // User routes
      {
        path: 'user',
        element: (
          <AuthGuard role={{ route: 'user', action: 'list' }}>
            <Users />
          </AuthGuard>
        ),
      },
      {
        path: 'user/create',
        element: (
          <AuthGuard role={{ route: 'user', action: 'create' }}>
            <CreateUser />
          </AuthGuard>
        ),
      },
      {
        path: 'user/update/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'update' }}>
            <UpdateUser />
          </AuthGuard>
        ),
      },
      {
        path: 'user/detail/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'detail' }}>
            <DetailUser />
          </AuthGuard>
        ),
      },

      // Role routes
      {
        path: 'role',
        element: (
          <AuthGuard role={{ route: 'role', action: 'list' }}>
            <Roles />
          </AuthGuard>
        ),
      },
      {
        path: 'role/create',
        element: (
          <AuthGuard role={{ route: 'role', action: 'create' }}>
            <CreateRole />
          </AuthGuard>
        ),
      },
      {
        path: 'role/update/:id',
        element: (
          <AuthGuard role={{ route: 'role', action: 'update' }}>
            <UpdateRole />
          </AuthGuard>
        ),
      },
      {
        path: 'role/detail/:id',
        element: (
          <AuthGuard role={{ route: 'role', action: 'detail' }}>
            <DetailRole />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/school',
    element: (<School />),
    children: [
      // Student routes
      {
        path: 'student',
        element: (
          <AuthGuard role={{ route: 'student', action: 'list' }}>
            <Students />
          </AuthGuard>
        ),
      },
      {
        path: 'student/create',
        element: (
          <AuthGuard role={{ route: 'student', action: 'create' }}>
            <CreateStudent />
          </AuthGuard>
        ),
      },
      {
        path: 'student/update/:id',
        element: (
          <AuthGuard role={{ route: 'student', action: 'update' }}>
            <UpdateStudent />
          </AuthGuard>
        ),
      },
      {
        path: 'student/detail/:id',
        element: (
          <AuthGuard role={{ route: 'student', action: 'detail' }}>
            <DetailStudent />
          </AuthGuard>
        ),
      },
      {
        path: 'student/:action/:id/:detail',
        element: (
          <AuthGuard role={{ route: 'student', action: 'detail' }}>
            <DetailFormStudent />
          </AuthGuard>
        ),
      },

      // Teacher routes
      {
        path: 'teacher',
        element: (
          <AuthGuard role={{ route: 'teacher', action: 'list' }}>
            <Teachers />
          </AuthGuard>
        ),
      },
      {
        path: 'teacher/create',
        element: (
          <AuthGuard role={{ route: 'teacher', action: 'create' }}>
            <CreateTeacher />
          </AuthGuard>
        ),
      },
      {
        path: 'teacher/update/:id',
        element: (
          <AuthGuard role={{ route: 'teacher', action: 'update' }}>
            <UpdateTeacher />
          </AuthGuard>
        ),
      },
      {
        path: 'teacher/detail/:id',
        element: (
          <AuthGuard role={{ route: 'teacher', action: 'detail' }}>
            <DetailTeacher />
          </AuthGuard>
        ),
      },

      // Grade routes
      {
        path: 'grade',
        element: (
          <AuthGuard role={{ route: 'grade', action: 'list' }}>
            <Grades />
          </AuthGuard>
        ),
      },
      {
        path: 'grade/create',
        element: (
          <AuthGuard role={{ route: 'grade', action: 'create' }}>
            <CreateGrade />
          </AuthGuard>
        ),
      },
      {
        path: 'grade/update/:id',
        element: (
          <AuthGuard role={{ route: 'grade', action: 'update' }}>
            <UpdateGrade />
          </AuthGuard>
        ),
      },
      {
        path: 'grade/:action/:id/subject',
        element: (
          <AuthGuard role={{ route: 'subject', action: 'list' }}>
            <SubjectGrade />
          </AuthGuard>
        ),
      },
      {
        path: 'grade/detail/:id',
        element: (
          <AuthGuard role={{ route: 'grade', action: 'detail' }}>
            <DetailGrade />
          </AuthGuard>
        ),
      },

      // Class routes
      {
        path: 'class',
        element: (
          <AuthGuard role={{ route: 'class', action: 'list' }}>
            <Classes />
          </AuthGuard>
        ),
      },
      {
        path: 'class/create',
        element: (
          <AuthGuard role={{ route: 'class', action: 'create' }}>
            <CreateClass />
          </AuthGuard>
        ),
      },
      {
        path: 'class/update/:id',
        element: (
          <AuthGuard role={{ route: 'class', action: 'update' }}>
            <UpdateClass />
          </AuthGuard>
        ),
      },
      {
        path: 'class/detail/:id',
        element: (
          <AuthGuard role={{ route: 'class', action: 'detail' }}>
            <DetailClass />
          </AuthGuard>
        ),
      },
      {
        path: 'class/:action/:id/student',
        element: (
          <AuthGuard role={{ route: 'class', action: 'detail' }}>
            <StudentClass />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/operation',
    element: (<AuthGuard role={{ route: 'attendance', action: 'list' }}><Operation /></AuthGuard>),
    children: [
      // Attendance routes
      {
        path: 'attendance',
        element: (
          <AuthGuard role={{ route: 'attendance', action: 'list' }}>
            <AttendanceClasses />
          </AuthGuard>
        ),
      },
      {
        path: 'attendance/class/:id',
        element: (
          <AuthGuard role={{ route: 'attendance', action: 'list' }}>
            <Attendances />
          </AuthGuard>
        ),
      },
      {
        path: 'attendance/class/:classId/student/:userId',
        element: (
          <AuthGuard role={{ route: 'attendance', action: 'report' }}>
            <AttendanceStudent />
          </AuthGuard>
        ),
      },
      {
        path: 'attendance/class/:classId/teacher/:userId',
        element: (
          <AuthGuard role={{ route: 'attendance', action: 'report' }}>
            <AttendanceTeacher />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/report',
    element: <Report />,
    children: [
      {
        path: 'school',
        element: <SchoolReport />,
      },
      {
        path: 'attendance',
        element: <AttendanceReport />,
      },
    ]
  },
  {
    path: '/report/attendance/:type/:userId',
    element: <AttendanceDetail />,
  },
  {
    path: '/config',
    element: <Config />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export default routes

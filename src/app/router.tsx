import { RouteObject } from 'react-router'
import AuthGuard from '../auth/AuthGuard'
import { Login } from 'modules/auth/Login'
import { Register } from 'modules/auth/Register'
import { Admin, Roles, CreateRole, UpdateRole, DetailRole, Users, CreateUser, UpdateUser, DetailUser } from 'modules/admin'
import { Report } from 'modules/report'
import { Counter } from 'modules/counter/Counter'
import Config from 'modules/config/Config'
import NotFound from 'components/shared/NotFound'
import { CreateStudent, CreateTeacher, DetailStudent, DetailTeacher, School, Students, Teachers, UpdateStudent, UpdateTeacher, DetailFormStudent, UpdateGrade, Grades, DetailGrade, CreateGrade, SubjectGrade, Classes, CreateClass, UpdateClass, DetailClass, StudentClass } from 'modules/school'
import { Operation, Classes as AttendanceClasses, Attendance } from 'modules/operation'

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthGuard role={{ route: 'admin', action: 'list' }}>
        <Counter />
      </AuthGuard>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/admin',
    element: (<AuthGuard role={{ route: 'admin', action: 'list' }}><Admin /></AuthGuard>),
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
    element: (<AuthGuard role={{ route: 'admin', action: 'list' }}><School /></AuthGuard>),
    children: [
      // Student routes
      {
        path: 'student',
        element: (
          <AuthGuard role={{ route: 'user', action: 'list' }}>
            <Students />
          </AuthGuard>
        ),
      },
      {
        path: 'student/create',
        element: (
          <AuthGuard role={{ route: 'user', action: 'create' }}>
            <CreateStudent />
          </AuthGuard>
        ),
      },
      {
        path: 'student/update/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'update' }}>
            <UpdateStudent />
          </AuthGuard>
        ),
      },
      {
        path: 'student/detail/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'detail' }}>
            <DetailStudent />
          </AuthGuard>
        ),
      },
      {
        path: 'student/:action/:id/:detail',
        element: (
          <AuthGuard role={{ route: 'user', action: 'detail' }}>
            <DetailFormStudent />
          </AuthGuard>
        ),
      },

      // Teacher routes
      {
        path: 'teacher',
        element: (
          <AuthGuard role={{ route: 'user', action: 'list' }}>
            <Teachers />
          </AuthGuard>
        ),
      },
      {
        path: 'teacher/create',
        element: (
          <AuthGuard role={{ route: 'user', action: 'create' }}>
            <CreateTeacher />
          </AuthGuard>
        ),
      },
      {
        path: 'teacher/update/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'update' }}>
            <UpdateTeacher />
          </AuthGuard>
        ),
      },
      {
        path: 'teacher/detail/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'detail' }}>
            <DetailTeacher />
          </AuthGuard>
        ),
      },

      // Grade routes
      {
        path: 'grade',
        element: (
          <AuthGuard role={{ route: 'user', action: 'list' }}>
            <Grades />
          </AuthGuard>
        ),
      },
      {
        path: 'grade/create',
        element: (
          <AuthGuard role={{ route: 'user', action: 'create' }}>
            <CreateGrade />
          </AuthGuard>
        ),
      },
      {
        path: 'grade/update/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'update' }}>
            <UpdateGrade />
          </AuthGuard>
        ),
      },
      {
        path: 'grade/:action/:id/subject',
        element: (
          <AuthGuard role={{ route: 'user', action: 'update' }}>
            <SubjectGrade />
          </AuthGuard>
        ),
      },
      {
        path: 'grade/detail/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'detail' }}>
            <DetailGrade />
          </AuthGuard>
        ),
      },

      // Class routes
      {
        path: 'class',
        element: (
          <AuthGuard role={{ route: 'user', action: 'list' }}>
            <Classes />
          </AuthGuard>
        ),
      },
      {
        path: 'class/create',
        element: (
          <AuthGuard role={{ route: 'user', action: 'create' }}>
            <CreateClass />
          </AuthGuard>
        ),
      },
      {
        path: 'class/update/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'update' }}>
            <UpdateClass />
          </AuthGuard>
        ),
      },
      {
        path: 'class/detail/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'detail' }}>
            <DetailClass />
          </AuthGuard>
        ),
      },
      {
        path: 'class/:action/:id/student',
        element: (
          <AuthGuard role={{ route: 'user', action: 'update' }}>
            <StudentClass />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/operation',
    element: (<AuthGuard role={{ route: 'admin', action: 'list' }}><Operation /></AuthGuard>),
    children: [
      // Attendance routes
      {
        path: 'attendance',
        element: (
          <AuthGuard role={{ route: 'user', action: 'list' }}>
            <AttendanceClasses />
          </AuthGuard>
        ),
      },
      {
        path: 'attendance/class/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'create' }}>
            <Attendance />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/report',
    element: <Report />,
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

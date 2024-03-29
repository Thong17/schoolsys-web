import { IBody } from 'shared/interface'

export interface IListRole {
  _id: string
  name: object
  description?: string
  privilege?: object
}

export interface ShareState {
  listRole: IBody<IListRole[]>
  listClass: IBody<IListRole[]>
  listGrade: IBody<IListRole[]>
  listTeacher: IBody<IListRole[]>
  privilege: IBody<Object>
  preRole: IBody<Object>
  operationDashboard: IBody<any>
  adminDashboard: IBody<any>
  schoolDashboard: IBody<any>
  reportSchoolDashboard: IBody<any>
  reportAttendanceDashboard: IBody<any>
  reportAcademyDashboard: IBody<any>
  detailAcademyDashboard: IBody<any>
}

export const initialState: ShareState = {
  listRole: {
    data: [],
    status: 'INIT',
  },
  listClass: {
    data: [],
    status: 'INIT',
  },
  listGrade: {
    data: [],
    status: 'INIT',
  },
  listTeacher: {
    data: [],
    status: 'INIT',
  },
  privilege: {
    data: {},
    status: 'INIT',
  },
  preRole: {
    data: {},
    status: 'INIT',
  },
  operationDashboard: {
    data: {},
    status: 'INIT',
  },
  adminDashboard: {
    data: {},
    status: 'INIT',
  },
  schoolDashboard: {
    data: {},
    status: 'INIT',
  },
  reportSchoolDashboard: {
    data: {},
    status: 'INIT',
  },
  reportAttendanceDashboard: {
    data: [],
    status: 'INIT',
    count: 0
  },
  reportAcademyDashboard: {
    data: [],
    status: 'INIT',
    count: 0
  },
  detailAcademyDashboard: {
    data: {},
    status: 'INIT',
  },
}

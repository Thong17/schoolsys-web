import { IBody } from 'shared/interface'

export interface TeacherState {
  list: IBody<Object[]>
  detail: IBody<any>
}

export const initialState: TeacherState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: {},
    status: 'INIT',
  }
}

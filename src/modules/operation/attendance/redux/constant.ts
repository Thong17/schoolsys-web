import { IBody } from 'shared/interface'

export interface AttendanceState {
  list: IBody<Object[]>
  detail: IBody<any>
}

export const initialState: AttendanceState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: {},
    status: 'INIT',
  }
}

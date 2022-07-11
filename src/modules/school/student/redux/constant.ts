import { IBody } from 'shared/interface'

export interface StudentState {
  list: IBody<Object[]>
  applied: IBody<Object[]>
  detail: IBody<any>
}

export const initialState: StudentState = {
  list: {
    data: [],
    status: 'INIT',
  },
  applied: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: {},
    status: 'INIT',
  }
}

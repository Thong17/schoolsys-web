import { IBody } from 'shared/interface'

export interface StudentState {
  list: IBody<Object[]>
  academy: IBody<Object[]>
  detail: IBody<any>
}

export const initialState: StudentState = {
  list: {
    data: [],
    status: 'INIT',
  },
  academy: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: {},
    status: 'INIT',
  }
}

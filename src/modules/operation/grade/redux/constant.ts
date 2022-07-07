import { IBody } from 'shared/interface'

export interface GradeState {
  list: IBody<Object[]>
  detail: IBody<any>
}

export const initialState: GradeState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: {},
    status: 'INIT',
  }
}

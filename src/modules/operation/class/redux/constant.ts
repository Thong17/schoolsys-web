import { IBody } from 'shared/interface'

export interface ClassState {
  list: IBody<Object[]>
  detail: IBody<any>
}

export const initialState: ClassState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: {},
    status: 'INIT',
  }
}

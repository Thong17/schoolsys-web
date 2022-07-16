import { IBody } from 'shared/interface'

export interface ClassState {
  list: IBody<Object[]>
  subject: IBody<any[]>
  student: IBody<Object[]>
  detail: IBody<any>
}

export const initialState: ClassState = {
  list: {
    data: [],
    status: 'INIT',
  },
  subject: {
    data: [],
    status: 'INIT',
  },
  student: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: {},
    status: 'INIT',
  }
}

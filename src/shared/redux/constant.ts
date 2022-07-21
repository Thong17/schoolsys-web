import { IBody } from "shared/interface"

export interface IListRole {
  _id: string,
  name: object,
  description?: string,
  privilege?: object,
}

export interface ShareState {
  listRole: IBody<IListRole[]>,
  privilege: IBody<Object>,
  preRole: IBody<Object>
  operationDashboard: IBody<any>
}

export const initialState: ShareState = {
  listRole: {
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
}

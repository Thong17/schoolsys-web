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

export const mapSubjectBody = (body) => {
  return {
    name: body.name,
    level: body.level,
    passScore: body.passScore,
    fullScore: body.fullScore,
    description: body.description,
  }
}

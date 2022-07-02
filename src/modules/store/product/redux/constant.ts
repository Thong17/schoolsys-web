import { IImage } from 'components/shared/form/UploadField'
import { IBody } from 'shared/interface'

export interface IProductBody {
  name: Object,
  price?: number,
  currency: string,
  code: string,
  status: boolean,
  description: string,
  isStock: boolean,
  profile: any,
  brand: string | null,
  category: string | null,
}

export interface IOptionBody {
  name: Object,
  price?: number,
  currency: string,
  description: string,
  profile?: any,
  imagePath?: IImage
}

export interface IColorBody {
  name: Object,
  code: string,
  price?: number,
  currency: string,
  description: string,
  profile?: any,
  images?: IImage[]
}

export interface IPropertyBody {
  name: Object,
  description: string,
}

export const initState: IProductBody = {
  name: {},
  currency: 'USD',
  price: undefined,
  code: '',
  status: true,
  description: '',
  isStock: false,
  profile: '',
  brand: '',
  category: '',
}

export const initOption: IOptionBody = {
  name: {},
  currency: 'USD',
  price: 0,
  description: '',
}

export const initColor: IColorBody = {
  name: {},
  code: '',
  currency: 'USD',
  price: 0,
  description: '',
}

export const initProperty: IPropertyBody = {
  name: {},
  description: '',
}

export const mapOptionBody = (body) => {
  return {
    name: body.name,
    currency: body.currency,
    price: body.price,
    description: body.description,
    profile: body.profile?._id,
    imagePath: body.profile && {
      _id: body.profile?._id,
      filename: body.profile?.filename
    }
  }
}

export const mapColorBody = (body) => {
  return {
    name: body.name,
    currency: body.currency,
    price: body.price,
    code: body.code,
    description: body.description,
    profile: body.profile?._id,
    images: body.images
  }
}

export const mapPropertyBody = (body) => {
  return {
    name: body.name,
    description: body.description,
  }
}

export interface ProductState {
  list: IBody<Object[]>
  detail: IBody<IProductBody>
  single: IBody<any>
}

export const initialState: ProductState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  },
  single: {
    data: initState,
    status: 'INIT',
  },
}

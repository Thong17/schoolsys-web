import {
  DetailField,
  LocaleField,
  TextField,
} from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { gradeSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const GradeForm = ({ defaultValues, id }: any) => {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(gradeSchema), defaultValues })
  const { device } = useWeb()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/school/grade/update/${id}` : `/school/grade/create`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        !id && navigate(`/school/grade/create/${data?.data?.data?._id}/subject`)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
  }
    
  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridColumnGap: 20,
        gridTemplateAreas:
          device === 'mobile'
            ? ` 
              'name name name' 
              'level level level'
              'description description description'
              'action action action'
            `
            : ` 
              'name name name' 
              'level level level'
              'description description description'
              'action action action'
            `,
      }}
    >
      <div style={{ gridArea: 'name', marginTop: 20 }}>
        <LocaleField
          name='name'
          err={errors?.name}
          describe='Grade Name'
          defaultValue={getValues('name')}
          onChange={handleLocaleChange}
        />
      </div>
      <div style={{ gridArea: 'level' }}>
        <TextField
          type='text'
          label='Level'
          err={errors.level?.message}
          {...register('level')}
        />
      </div>
      <div style={{ gridArea: 'description' }}>
        <DetailField
          type='text'
          label='Description'
          err={errors.description?.message}
          style={{ height: 70 }}
          {...register('description')}
        />
      </div>
      <div
        style={{
          gridArea: 'action',
          marginTop: 10,
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button variant='contained' color='error' onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button
          loading={loading}
          type='submit'
          variant='contained'
          color='success'
          style={{ marginLeft: 20 }}
        >
          {id ? 'Save' : 'Create'}
        </Button>
      </div>
    </form>
  )
}

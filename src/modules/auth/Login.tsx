import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from './schema'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { useLocation, useNavigate } from 'react-router'
import { TextField } from 'components/shared/form'
import { CardContainer } from 'components/shared/container/CardContainer'
import useTheme from 'hooks/useTheme'
import { Button } from '@mui/material'

export const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) })
  const { login } = useAuth()
  const { notify } = useNotify()
  const { theme } = useTheme()

  const form = async (data) => {
    const response: any = await login(data)
    if (response?.code !== 'SUCCESS') return notify(response?.msg, 'error')
    navigate(location.state ? (location.state as string) : '/admin')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', color: theme.text.secondary, fontWeight: theme.font.weight, fontFamily: theme.font.family }}>
      <CardContainer title='Login'>
        <form onSubmit={handleSubmit(form)} style={{ padding: '20px 30px 50px 30px', width: '500px' }}>
          <TextField
            label='Username'
            type='text'
            err={errors.username?.message}
            {...register('username')}
          />
          <TextField
            label='Password'
            type='password'
            err={errors.password?.message}
            {...register('password')}
          />
          <Button fullWidth style={{ marginTop: 30, backgroundColor: theme.background.secondary }}  variant='contained' type='submit'>Login</Button>
          {/* <button onClick={() => navigate('/register')}>Register</button> */}
        </form>
      </CardContainer>
    </div>
  )
}

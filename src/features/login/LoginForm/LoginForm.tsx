import React from 'react'
import { useNavigate } from 'react-router-dom'
import { styled, Button, Typography, TextField, css, Divider, alpha } from '@mui/material'
import { Link as MuiLink } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import { useAppDispatch } from '../../../redux/hooks'
import { User } from '../../../types/User'
import { authenticateUser } from '../actions'
import { resetAuthState } from '../../application/slice'
import { paths } from '../../../api'

export type LoginFormType = Pick<User, 'email'> & { password: string }

interface LoginFormProps {
  registerClick: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ registerClick }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormType>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const resetForm = () => {
    reset({ email: '', password: '' })
  }

  const handleLoginSubmit: SubmitHandler<LoginFormType> = async formData => {
    dispatch(authenticateUser(formData)).then(() => {
      dispatch(resetAuthState())
      resetForm()
      navigate(paths.DASHBOARD)
    })
  }

  const goToRegister = () => {
    registerClick()
    resetForm()
  }

  return (
    <Container>
      <IconWrapper>
        <LockOutlinedIcon sx={{ fontSize: 28, color: '#6C63FF' }} />
      </IconWrapper>
      <FormTitle variant="h4">Sign in</FormTitle>
      <FormSubtitle variant="body2">Enter your credentials to continue</FormSubtitle>
      <FormWrapper onSubmit={handleSubmit(handleLoginSubmit)}>
        <StyledTextField
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: 'Invalid email address',
            },
          })}
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message}
          size="small"
          fullWidth
          variant="filled"
          color="primary"
        />
        <StyledTextField
          {...register('password')}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          size="small"
          fullWidth
          variant="filled"
          color="primary"
        />
        <ForgotLink href="" variant="caption">
          Forgot password?
        </ForgotLink>

        <LoginButton variant="contained" type="submit">
          Sign In
        </LoginButton>
      </FormWrapper>

      <StyledDivider>
        <DividerText>or</DividerText>
      </StyledDivider>
      <RegisterButton variant="outlined" onClick={goToRegister}>
        Create Account
      </RegisterButton>
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 36px;
  background: ${alpha('#131738', 0.85)};
  backdrop-filter: blur(24px);
  border: 1px solid ${alpha('#6C63FF', 0.12)};
  border-radius: 24px;
  box-shadow:
    0 32px 64px -12px ${alpha('#000', 0.4)},
    0 0 1px 0 ${alpha('#6C63FF', 0.3)};
  min-width: 380px;
`

const IconWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${alpha('#6C63FF', 0.15)} 0%, ${alpha('#FF6B9D', 0.1)} 100%);
  margin-bottom: 4px;
`

const FormWrapper = styled('form')`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
`

const FormTitle = styled(Typography)`
  text-align: center;
  font-weight: 700;
  color: #E8E8F0;
`

const FormSubtitle = styled(Typography)`
  color: #9B9BB4;
  margin-bottom: 12px;
`

const ForgotLink = styled(MuiLink)`
  color: #9D97FF;
  text-decoration: none;
  font-size: 0.8rem;
  margin-top: 2px;
  &:hover {
    color: #6C63FF;
    text-decoration: underline;
  }
`

const LoginButton = styled(Button)`
  margin-top: 12px;
  padding: 12px;
  font-size: 0.95rem;
  background: linear-gradient(135deg, #6C63FF 0%, #9D97FF 100%);
  &:hover {
    background: linear-gradient(135deg, #7B73FF 0%, #ADA8FF 100%);
    box-shadow: 0 12px 30px -8px ${alpha('#6C63FF', 0.5)};
  }
`

const StyledDivider = styled(Divider)`
  width: 100%;
  &::before, &::after {
    border-color: ${alpha('#6C63FF', 0.15)};
  }
`

const DividerText = styled(Typography)`
  color: #9B9BB4;
  font-size: 0.8rem;
  padding: 0 12px;
`

const RegisterButton = styled(Button)`
  width: 100%;
  border-color: ${alpha('#00D68F', 0.4)};
  color: #00D68F;
  &:hover {
    border-color: #00D68F;
    background: ${alpha('#00D68F', 0.08)};
    box-shadow: 0 8px 20px -8px ${alpha('#00D68F', 0.3)};
  }
`

const StyledTextField = styled(TextField)`
  ${props =>
    !props.error &&
    css`
      margin-bottom: 16px;
    `}
`

import React from 'react'
import {
  styled,
  Button,
  Typography,
  FormLabel,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  css,
  alpha,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'

import { SubmitHandler, useController, useForm } from 'react-hook-form'

import { BaseUser, RegisterUserDTO, Role } from '../../../types/User'
import { useAppDispatch } from '../../../redux/hooks'
import { addUser } from '../actions'
import { resetAuthState } from '../../application/slice'

export type RegistrationFormType = BaseUser & {
  password: string
  confirmPassword: string
  terms: boolean
}

interface RegistrationFormProps {
  loginClick: () => void
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ loginClick }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    control,
  } = useForm<RegistrationFormType>()

  const dispatch = useAppDispatch()

  const { field: roleField } = useController({
    name: 'role',
    control,
    rules: { required: true },
    defaultValue: Role.STUDENT,
  })

  const resetForm = () => {
    reset({
      email: '',
      fullName: '',
      role: Role.STUDENT,
      password: '',
      confirmPassword: '',
      terms: false,
    })
  }

  const handleRegistrationSubmit: SubmitHandler<RegistrationFormType> = formData => {
    const userData: RegisterUserDTO = {
      email: formData.email,
      fullName: formData.fullName,
      role: formData.role,
      password: formData.password,
    }

    dispatch(addUser(userData)).then(response => {
      if (response.type === 'addUser/fulfilled') {
        resetForm()
        loginClick()
        dispatch(resetAuthState())
      }
    })
  }

  const goToLogin = () => {
    resetForm()
    loginClick()
  }

  return (
    <Container>
      <ArrowBack onClick={goToLogin} />
      <IconWrapper>
        <PersonAddAltIcon sx={{ fontSize: 28, color: '#00D68F' }} />
      </IconWrapper>
      <FormTitle variant="h4">Sign Up</FormTitle>
      <FormSubtitle variant="body2">Create your account to get started</FormSubtitle>
      <FormWrapper onSubmit={handleSubmit(handleRegistrationSubmit)}>
        <TextFieldGroup>
          <StyledTextField
            {...register('fullName', { required: 'Full Name is required' })}
            label="Full Name"
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            variant="filled"
            size="small"
          />
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
            variant="filled"
            size="small"
          />
        </TextFieldGroup>
        <StyledTextField
          {...register('password', {
            required: 'Password is required',
            minLength: 6,
          })}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          size="small"
          variant="filled"
          fullWidth
        />
        <StyledTextField
          {...register('confirmPassword', {
            required: 'Confirm Password is required',
            minLength: 6,
            validate: {
              passwordsNotMatching: confirmPasswordValue =>
                confirmPasswordValue === getValues('password') || 'Password not matching',
            },
          })}
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          size="small"
          variant="filled"
          fullWidth
        />
        <RoleLabel>I want to participate as</RoleLabel>
        <StyledRadioGroup value={roleField.value}>
          <FormControlLabel
            onChange={() => {
              roleField.onChange(Role.STUDENT)
              roleField.onBlur()
            }}
            value={Role.STUDENT}
            control={<Radio size="small" sx={{ color: '#6C63FF', '&.Mui-checked': { color: '#6C63FF' } }} />}
            label="Student"
          />
          <FormControlLabel
            onChange={() => {
              roleField.onChange(Role.MENTOR)
              roleField.onBlur()
            }}
            value={Role.MENTOR}
            control={<Radio size="small" sx={{ color: '#FF6B9D', '&.Mui-checked': { color: '#FF6B9D' } }} />}
            label="Mentor"
          />
        </StyledRadioGroup>

        <RegisterButton variant="contained" type="submit">
          Create Account
        </RegisterButton>
      </FormWrapper>
    </Container>
  )
}

const Container = styled('div')`
  position: relative;
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
  background: linear-gradient(135deg, ${alpha('#00D68F', 0.15)} 0%, ${alpha('#6C63FF', 0.1)} 100%);
  margin-bottom: 4px;
`

const FormWrapper = styled('form')`
  display: flex;
  flex-direction: column;
  width: 350px;
  gap: 4px;
`

const FormTitle = styled(Typography)`
  text-align: center;
  font-weight: 700;
  color: #E8E8F0;
`

const FormSubtitle = styled(Typography)`
  color: #9B9BB4;
  margin-bottom: 8px;
`

const ArrowBack = styled(ArrowBackIcon)`
  position: absolute;
  top: 24px;
  left: 24px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  color: #9B9BB4;
  transition: all 0.2s ease;
  padding: 4px;
  border-radius: 8px;

  :hover {
    color: #6C63FF;
    background: ${alpha('#6C63FF', 0.1)};
  }
`

const TextFieldGroup = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 16px;
`

const StyledTextField = styled(TextField)`
  ${props =>
    !props.error &&
    css`
      margin-bottom: 16px;
    `}
`

const RoleLabel = styled(FormLabel)`
  color: #9B9BB4;
  font-size: 0.9rem;
  margin-top: 8px;
`

const StyledRadioGroup = styled(RadioGroup)`
  .MuiFormControlLabel-label {
    color: #E8E8F0;
    font-size: 0.9rem;
  }
`

const RegisterButton = styled(Button)`
  margin-top: 12px;
  padding: 12px;
  font-size: 0.95rem;
  background: linear-gradient(135deg, #00D68F 0%, #00B87A 100%);
  color: white;
  &:hover {
    background: linear-gradient(135deg, #00E69A 0%, #00D68F 100%);
    box-shadow: 0 12px 30px -8px ${alpha('#00D68F', 0.5)};
  }
`

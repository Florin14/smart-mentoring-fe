import { RegisterUserDTO } from '../../types/User'
import { axiosInstance } from '../../api'

export const addUserCall = async (user: RegisterUserDTO) => axiosInstance.post('/auth/register', user)

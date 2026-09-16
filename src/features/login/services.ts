import { LoginResponseBody, LoginUserDTO } from '../../types/User'
import { axiosInstance } from '../../api'
import { AxiosResponse } from 'axios'

export const loginCall = async (user: LoginUserDTO): Promise<AxiosResponse<LoginResponseBody>> =>
  axiosInstance.post('/auth/login', user, { headers: { Authorization: undefined } })

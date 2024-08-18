import { InterestArea, Study, UserDto } from '../../types/User'
import { axiosInstance } from '../../api'
import { AxiosResponse } from 'axios'
import { Response } from '../../types/Response'
import { ProfileSubmitType } from './ProfilePage'
import { InterestAreaRequestDto } from '../../types/InterestAreas'

export const fetchUserCall = async (): Promise<AxiosResponse<Response<UserDto>>> => axiosInstance.get('/users/profile')

export const updateUserCall = async (usersFormData: ProfileSubmitType): Promise<AxiosResponse<Response<UserDto>>> =>
  axiosInstance.put('/users/profile', usersFormData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const fetchUserAvatarCall = async (): Promise<AxiosResponse<any>> =>
  axiosInstance.get('/users/profile/picture')

export const fetchCompletedStudiesOptionsCall = async (): Promise<AxiosResponse<Response<Study[]>>> =>
  axiosInstance.get('/studies')

export const fetchInterestAreasOptionsCall = async (): Promise<AxiosResponse<Response<InterestArea[]>>> =>
  axiosInstance.get('/interest-areas')

export const createInterestAreaCall = async (
  interestArea: InterestAreaRequestDto
): Promise<AxiosResponse<InterestAreaRequestDto>> => axiosInstance.post('/interest-areas', interestArea)
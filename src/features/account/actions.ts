import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  createInterestAreaCall,
  fetchCompletedStudiesOptionsCall,
  fetchInterestAreasOptionsCall,
  fetchUserAvatarCall,
  fetchUserCall,
  updateInterestAreaCall,
  updateUserCall,
} from './services'
import { ProfileSubmitType } from './ProfilePage'
import { updateAvatar } from './slice'
import { InterestArea } from '../../types/User'
import { InterestAreaRequestDto, UpdateInterestAreaRequestDto } from '../../types/InterestAreas'

export const fetchUserData = createAsyncThunk('fetchUserData', async () => {
  const response = await fetchUserCall()

  return response.data.data
})

export const updateUserData = createAsyncThunk(
  'updateUserData',
  async (usersFormData: ProfileSubmitType, { dispatch }) => {
    const response = await updateUserCall(usersFormData)

    dispatch(fetchUserAvatar())

    return response.data.data
  }
)

export const updateUserAvatar = createAsyncThunk(
  'updateUserAvatar',
  async (usersFormData: ProfileSubmitType,) => {
    const response = await updateUserCall(usersFormData)

    return response.data.data
  }
)

export const fetchUserAvatar = createAsyncThunk('fetchUserAvatar', async ( _, { dispatch }) => {
  const response = await fetchUserAvatarCall()
  dispatch(updateAvatar({profilePicture: response.data.data.profilePicture}))
  return response.data.data.profilePicture
})

export const fetchCompletedStudiesOptions = createAsyncThunk('fetchCompletedStudiesOptions', async () => {
  const response = await fetchCompletedStudiesOptionsCall()

  return response.data.data
})

export const fetchInterestAreasOptions = createAsyncThunk('fetchInterestAreasOptions', async () => {
  const response = await fetchInterestAreasOptionsCall()

  return response.data.data
})

export const addInterestArea = createAsyncThunk('addInterestArea', async (interestArea: InterestAreaRequestDto) => {
  const response = await createInterestAreaCall(interestArea)

  return response.data
})

export const updateInterestArea = createAsyncThunk('updateInterestArea', async (interestArea: UpdateInterestAreaRequestDto) => {
  const response = await updateInterestAreaCall(interestArea)

  return response.data
})

import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchCompletedStudiesOptionsCall,
  fetchInterestAreasOptionsCall,
  fetchUserAvatarCall,
  fetchUserCall,
  updateUserCall,
} from './services'
import { ProfileSubmitType } from './ProfilePage'
import { updateAvatar } from './slice'

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
  dispatch(updateAvatar({avatar: response.data.data.avatar}))
  return response.data.data.avatar
})

export const fetchCompletedStudiesOptions = createAsyncThunk('fetchCompletedStudiesOptions', async () => {
  const response = await fetchCompletedStudiesOptionsCall()

  return response.data.data
})

export const fetchInterestAreasOptions = createAsyncThunk('fetchInterestAreasOptions', async () => {
  const response = await fetchInterestAreasOptionsCall()

  return response.data.data
})

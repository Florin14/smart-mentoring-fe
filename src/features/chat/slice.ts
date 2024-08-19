import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Assignment } from '../../types/Assignment'
import { createAssignment, deleteAssignment, fetchAssignments, fetchMentorStudents, updateAssignment } from './actions'
import { BaseUser } from '../../types/User'

export interface ChatState {
  chatMenuOpen: boolean
}

const initialState: ChatState = {
  chatMenuOpen: false
}

export const chatSlice = createSlice({
  name: 'chatState',
  initialState,
  reducers: {
    handleContactMenu: (state, action) => {
      state.chatMenuOpen = action.payload.isOpen
    },
  },
  extraReducers: () => {},
})

export const { handleContactMenu } = chatSlice.actions

export default chatSlice.reducer

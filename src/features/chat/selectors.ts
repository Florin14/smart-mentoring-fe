import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../redux/store'

const getChatState = (state: RootState) => state.chatState

export const selectIsChatMenuOpen = createSelector(
  [getChatState],
  chatState => chatState.chatMenuOpen
)
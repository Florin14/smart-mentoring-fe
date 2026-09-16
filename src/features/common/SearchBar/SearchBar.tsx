import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import { alpha, styled, Input } from '@mui/material'
import { useNavigate } from 'react-router'
import { paths } from '../../../api'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { fetchFilterAnnouncements } from '../../announcements/actions'
import {
  selectAnnouncementsData,
  selectAnnouncementsResultsError,
  selectAnnouncementsResultsLoading,
} from '../../announcements/selectors'

import { Loader } from '../Loader'

export const SearchBar: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchInputText, setSearchInputText] = useState('')
  const resultsAnnouncementsLoading = useAppSelector(selectAnnouncementsResultsLoading)
  const resultsAnnouncementsError = useAppSelector(selectAnnouncementsResultsError)
  const resultsAnnouncementsData = useAppSelector(selectAnnouncementsData)

  if (resultsAnnouncementsLoading) {
    return <Loader fullscreen={true} />
  }

  if (resultsAnnouncementsError || !resultsAnnouncementsData) {
    return null
  }

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    navigate(paths.ANNOUNCEMENTS)
    setSearchInputText(event.target.value)
  }

  const handleSearchSubmit = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      dispatch(fetchFilterAnnouncements(searchInputText))
    }
  }

  return (
    <Container>
      <SearchIcon />
      <SearchInput
        placeholder="Search announcements..."
        onChange={handleSearchInputChange}
        onKeyDown={handleSearchSubmit}
        disableUnderline={true}
      />
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  align-items: center;
  background: ${alpha('#6C63FF', 0.08)};
  border: 1px solid ${alpha('#6C63FF', 0.15)};
  border-radius: 12px;
  height: 40px;
  min-width: 320px;
  padding: 0 12px;
  transition: all 0.2s ease;
  &:focus-within {
    border-color: ${alpha('#6C63FF', 0.4)};
    background: ${alpha('#6C63FF', 0.12)};
    box-shadow: 0 0 0 3px ${alpha('#6C63FF', 0.1)};
  }
`

const SearchInput = styled(Input)`
  flex: 1;
  input {
    color: #E8E8F0;
    font-size: 0.9rem;
    &::placeholder {
      color: #9B9BB4;
      opacity: 1;
    }
  }
`

const SearchIcon = styled(SearchSharpIcon)`
  color: #9B9BB4;
  font-size: 20px;
  margin-right: 8px;
`

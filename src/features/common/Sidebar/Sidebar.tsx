import React from 'react'
import { matchPath, useLocation } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { alpha, Backdrop, css, List, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material'
import { toggleSidebar } from '../../application/slice'
import { selectSidebarExpanded } from '../../application/selectors'

import MenuIcon from '@mui/icons-material/Menu'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import ScheduleIcon from '@mui/icons-material/Schedule'
import NoteAltIcon from '@mui/icons-material/NoteAlt'

import { paths } from '../../../api'

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const activeItem = (itemPath: string) => {
    return !!matchPath(itemPath, pathname)
  }

  const sidebarExpanded = useAppSelector(selectSidebarExpanded)

  return (
    <Container>
      <ExpandableList expanded={sidebarExpanded}>
        <CustomToggleListItem onClick={() => dispatch(toggleSidebar())}>
          <ListItemIcon>
            <MenuIcon />
          </ListItemIcon>
        </CustomToggleListItem>
        <CustomListItem selected={activeItem(paths.ANNOUNCEMENTS)} onClick={() => navigate(paths.ANNOUNCEMENTS)}>
          <ListItemIcon>
            <NewspaperIcon />
          </ListItemIcon>
          <ListItemText primary="Announcements" />
        </CustomListItem>
        <CustomListItem selected={activeItem(paths.PROFILE)} onClick={() => navigate(paths.PROFILE)}>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </CustomListItem>
        <CustomListItem selected={activeItem(paths.APPOINTMENTS)} onClick={() => navigate(paths.APPOINTMENTS)}>
          <ListItemIcon>
            <ScheduleIcon />
          </ListItemIcon>
          <ListItemText primary="Appointments" />
        </CustomListItem>
        <CustomListItem selected={activeItem(paths.ASSIGNMENTS)} onClick={() => navigate(paths.ASSIGNMENTS)}>
          <ListItemIcon>
            <NoteAltIcon />
          </ListItemIcon>
          <ListItemText primary="Assignments" />
        </CustomListItem>
        <CustomListItem selected={activeItem(paths.CHAT)} onClick={() => navigate(paths.CHAT)}>
          <ListItemIcon>
            <NoteAltIcon />
          </ListItemIcon>
          <ListItemText primary="Chat" />
        </CustomListItem>
      </ExpandableList>

      {/* <Backdrop open={sidebarExpanded} sx={{ zIndex: 1 }} /> */}
    </Container>
  )
}

const Container = styled('div')`
  position: relative;
  width: fit-content;
  zindex: 2;
  @media only screen and (max-width: 900px) {
    position: fixed;
  }
`

const ExpandableList = styled(List, { shouldForwardProp: prop => prop !== 'expanded' })<{ expanded?: boolean }>`
  transition: all 0.15s ease-in-out;
  overflow: hidden;

  width: ${props => (props.expanded ? '300px' : '55px')};
`

const CustomListItem = styled(ListItemButton)`
  ${props =>
    props.selected &&
    css`
      background: ${alpha(props.theme.palette.secondary.light, 0.2)} !important;
    `}
`

const CustomToggleListItem = styled(ListItemButton)`
  @media only screen and (max-width: 900px) {
    visibility: hidden;
  }
`
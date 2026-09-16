import React from 'react'
import { matchPath, useLocation } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { alpha, List, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material'
import { toggleSidebar } from '../../application/slice'
import { selectSidebarExpanded } from '../../application/selectors'

import MenuIcon from '@mui/icons-material/Menu'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import ScheduleIcon from '@mui/icons-material/Schedule'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import DashboardIcon from '@mui/icons-material/Dashboard'

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
        <ToggleItem onClick={() => dispatch(toggleSidebar())}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <MenuIcon sx={{ color: '#9B9BB4' }} />
          </ListItemIcon>
        </ToggleItem>
        <NavItem selected={activeItem(paths.DASHBOARD)} onClick={() => navigate(paths.DASHBOARD)}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <DashboardIcon sx={{ color: activeItem(paths.DASHBOARD) ? '#6C63FF' : '#9B9BB4' }} />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: activeItem(paths.DASHBOARD) ? 600 : 400,
            }}
          />
        </NavItem>
        <NavItem selected={activeItem(paths.ANNOUNCEMENTS)} onClick={() => navigate(paths.ANNOUNCEMENTS)}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <NewspaperIcon sx={{ color: activeItem(paths.ANNOUNCEMENTS) ? '#6C63FF' : '#9B9BB4' }} />
          </ListItemIcon>
          <ListItemText
            primary="Announcements"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: activeItem(paths.ANNOUNCEMENTS) ? 600 : 400,
            }}
          />
        </NavItem>
        <NavItem selected={activeItem(paths.PROFILE)} onClick={() => navigate(paths.PROFILE)}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <AccountBoxIcon sx={{ color: activeItem(paths.PROFILE) ? '#6C63FF' : '#9B9BB4' }} />
          </ListItemIcon>
          <ListItemText
            primary="Profile"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: activeItem(paths.PROFILE) ? 600 : 400,
            }}
          />
        </NavItem>
        <NavItem selected={activeItem(paths.APPOINTMENTS)} onClick={() => navigate(paths.APPOINTMENTS)}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <ScheduleIcon sx={{ color: activeItem(paths.APPOINTMENTS) ? '#6C63FF' : '#9B9BB4' }} />
          </ListItemIcon>
          <ListItemText
            primary="Appointments"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: activeItem(paths.APPOINTMENTS) ? 600 : 400,
            }}
          />
        </NavItem>
        <NavItem selected={activeItem(paths.ASSIGNMENTS)} onClick={() => navigate(paths.ASSIGNMENTS)}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <NoteAltIcon sx={{ color: activeItem(paths.ASSIGNMENTS) ? '#6C63FF' : '#9B9BB4' }} />
          </ListItemIcon>
          <ListItemText
            primary="Assignments"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: activeItem(paths.ASSIGNMENTS) ? 600 : 400,
            }}
          />
        </NavItem>
        <NavItem selected={activeItem(paths.CHAT)} onClick={() => navigate(paths.CHAT)}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <ChatBubbleOutlineIcon sx={{ color: activeItem(paths.CHAT) ? '#6C63FF' : '#9B9BB4' }} />
          </ListItemIcon>
          <ListItemText
            primary="Chat"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: activeItem(paths.CHAT) ? 600 : 400,
            }}
          />
        </NavItem>
        <NavItem selected={activeItem(paths.MENTOR_MATCHING)} onClick={() => navigate(paths.MENTOR_MATCHING)}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <AutoAwesomeIcon sx={{ color: activeItem(paths.MENTOR_MATCHING) ? '#FF6B9D' : '#9B9BB4' }} />
          </ListItemIcon>
          <ListItemText
            primary="Find Mentor"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: activeItem(paths.MENTOR_MATCHING) ? 600 : 400,
              background: activeItem(paths.MENTOR_MATCHING)
                ? 'linear-gradient(135deg, #6C63FF, #FF6B9D)'
                : 'none',
              WebkitBackgroundClip: activeItem(paths.MENTOR_MATCHING) ? 'text' : 'unset',
              WebkitTextFillColor: activeItem(paths.MENTOR_MATCHING) ? 'transparent' : 'inherit',
            }}
          />
        </NavItem>
      </ExpandableList>
    </Container>
  )
}

const Container = styled('div')`
  position: relative;
  width: fit-content;
  z-index: 10;
  @media only screen and (max-width: 900px) {
    position: fixed;
  }
`

const ExpandableList = styled(List, { shouldForwardProp: prop => prop !== 'expanded' })<{ expanded?: boolean }>`
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  width: ${props => (props.expanded ? '260px' : '56px')};
  background: ${alpha('#131738', 0.5)};
  border-radius: 16px;
  border: 1px solid ${alpha('#6C63FF', 0.08)};
  padding: 8px 0;
`

const NavItem = styled(ListItemButton)`
  border-radius: 12px;
  margin: 2px 8px;
  transition: all 0.2s ease;
  color: #E8E8F0;

  &.Mui-selected {
    background: linear-gradient(135deg, ${alpha('#6C63FF', 0.12)} 0%, ${alpha('#FF6B9D', 0.06)} 100%);
    border-left: 3px solid #6C63FF;
    &:hover {
      background: linear-gradient(135deg, ${alpha('#6C63FF', 0.18)} 0%, ${alpha('#FF6B9D', 0.1)} 100%);
    }
  }

  &:hover {
    background: ${alpha('#6C63FF', 0.06)};
  }
`

const ToggleItem = styled(ListItemButton)`
  border-radius: 12px;
  margin: 2px 8px;
  &:hover {
    background: ${alpha('#6C63FF', 0.06)};
  }
  @media only screen and (max-width: 900px) {
    visibility: hidden;
  }
`

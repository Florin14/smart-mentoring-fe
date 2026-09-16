import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  alpha,
  css,
  InputAdornment,
  styled,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { SearchBar } from '../SearchBar/SearchBar'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import IconButton from '@mui/material/IconButton'
import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { NotificationBell } from '../../notifications/NotificationBell'
import { toggleSidebar } from '../../application/slice'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { initialPictureURL } from '../../account/utils'
import { selectUserAvatar } from '../../account/selectors'
import { selectIsChatMenuOpen } from '../../chat/selectors'
import { handleContactMenu } from '../../chat/slice'
import ChatComponent from '../../chat/ChatComponent/ChatComponent'

export const NavBar: React.FC = () => {
  const [showMessagesMenu, setShowMessagesMenu] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMatch = useMediaQuery(theme.breakpoints.down('md'))
  const menuRef = useRef<HTMLDivElement | null>(null)
  const userAvatar = useAppSelector(selectUserAvatar)
  const isMenuOpen = useAppSelector(selectIsChatMenuOpen)

  const getPictureSrc = () => {
    if (!userAvatar) {
      return initialPictureURL
    }
    if (userAvatar instanceof File || typeof userAvatar == 'string') {
      return userAvatar instanceof File ? URL.createObjectURL(userAvatar) : `data:image/jpeg;base64,${userAvatar}`
    }
    return initialPictureURL
  }

  const toggleMessages = () => {
    if (showMessagesMenu || isMenuOpen) {
      dispatch(handleContactMenu({ isOpen: false }))
      setShowMessagesMenu(false)
    } else {
      dispatch(handleContactMenu({ isOpen: true }))
      setShowMessagesMenu(true)
    }
  }

  return (
    <Container>
      {isMatch ? (
        <>
          <StyledIconButton size="large" onClick={() => dispatch(toggleSidebar())}>
            <MenuIcon />
          </StyledIconButton>
          <LogoSection>
            <AutoAwesomeIcon sx={{ fontSize: 20, color: '#6C63FF' }} />
            <FancyText variant="h6">Smart Mentoring</FancyText>
          </LogoSection>
          <RightSection>
            <Tooltip title="Messages">
              <div ref={menuRef}>
                <StyledIconButton size="large" onClick={toggleMessages}>
                  <MailIcon />
                </StyledIconButton>
              </div>
            </Tooltip>
            <Tooltip title="Sign out">
              <StyledIconButton size="large" onClick={() => navigate('/logout')}>
                <LogoutIcon />
              </StyledIconButton>
            </Tooltip>
            <Picture src={getPictureSrc()} onClick={() => navigate('/profile')} />
          </RightSection>
        </>
      ) : (
        <NavContainer>
          <LeftSection>
            <LogoSection>
              <AutoAwesomeIcon sx={{ fontSize: 20, color: '#6C63FF' }} />
              <FancyText variant="h6">Smart Mentoring</FancyText>
            </LogoSection>
          </LeftSection>
          <SearchBar />
          <RightSection>
            <NotificationBell />
            <Tooltip title="Messages">
              <div ref={menuRef}>
                <StyledIconButton size="large" onClick={toggleMessages}>
                  <MailIcon />
                </StyledIconButton>
              </div>
            </Tooltip>
            <Tooltip title="Sign out">
              <StyledIconButton size="large" onClick={() => navigate('/logout')}>
                <LogoutIcon />
              </StyledIconButton>
            </Tooltip>
            <Picture src={getPictureSrc()} onClick={() => navigate('/profile')} />
          </RightSection>
        </NavContainer>
      )}
      {(showMessagesMenu || isMenuOpen) && (
        <DropdownMenu open={showMessagesMenu || isMenuOpen}>
          <TopSection>
            <DropdownTitle>Inbox</DropdownTitle>
          </TopSection>
          <SearchWrapper>
            <SearchInput
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search in Inbox"
              size="small"
              fullWidth
            />
          </SearchWrapper>
          <ChatComponent />
        </DropdownMenu>
      )}
    </Container>
  )
}

const Container = styled('div')`
  width: 100%;
  height: 64px;
  background: ${alpha('#0A0E27', 0.85)};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${alpha('#6C63FF', 0.1)};
  color: #E8E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  text-align: center;
  position: fixed;
  z-index: 100;
  padding: 0 24px;
`

const NavContainer = styled('div')`
  display: flex;
  width: 100%;
  justify-content: space-between;
  height: inherit;
  align-items: center;
`

const LogoSection = styled('div')`
  display: flex;
  align-items: center;
  gap: 10px;
`

const FancyText = styled(Typography)`
  display: flex;
  font-weight: 700;
  color: #E8E8F0;
  letter-spacing: -0.01em;
`

const RightSection = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
  gap: 4px;
`

const Picture = styled('img')`
  object-fit: cover;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid ${alpha('#6C63FF', 0.3)};
  transition: all 0.2s ease;
  margin-left: 8px;
  &:hover {
    border-color: #6C63FF;
    box-shadow: 0 0 12px ${alpha('#6C63FF', 0.3)};
  }
`

const LeftSection = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
  gap: 20px;
`

const StyledIconButton = styled(IconButton)`
  color: #9B9BB4;
  transition: all 0.2s ease;
  border-radius: 12px;
  &:hover {
    color: #6C63FF;
    background: ${alpha('#6C63FF', 0.08)};
  }
`

const DropdownMenu = styled('div')<{ open: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  background: ${alpha('#131738', 0.95)};
  backdrop-filter: blur(24px);
  border: 1px solid ${alpha('#6C63FF', 0.15)};
  top: 68px;
  right: 24px;
  border-radius: 20px;
  padding: 20px;
  width: 340px;
  min-height: 200px;
  opacity: 0;
  overflow: auto;
  visibility: hidden;
  transform: translateY(-12px);
  box-shadow: 0 24px 48px -12px ${alpha('#000', 0.4)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${props =>
    props.open &&
    css`
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    `}
`

const TopSection = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
`

const DropdownTitle = styled(Typography)`
  color: #E8E8F0;
  font-size: 18px;
  font-weight: 700;
`

const SearchWrapper = styled('div')`
  width: 100%;
  margin-bottom: 12px;
`

const SearchInput = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 12px;
    background: ${alpha('#6C63FF', 0.06)};
    border: 1px solid ${alpha('#6C63FF', 0.12)};
    fieldset {
      border: none;
    }
  }
`

const SearchIcon = styled(SearchSharpIcon)`
  color: #9B9BB4;
`

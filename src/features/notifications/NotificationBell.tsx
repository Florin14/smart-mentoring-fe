import React, { useEffect, useState } from 'react'
import {
  alpha,
  Badge,
  css,
  IconButton,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { axiosInstance } from '../../api'

interface Notification {
  id: number
  message: string
  createdAt: string
  isRead: boolean
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        axiosInstance.get('/notifications?limit=10'),
        axiosInstance.get('/notifications/unread/count'),
      ])
      setNotifications(notifRes.data || [])
      setUnreadCount(countRes.data?.count ?? 0)
    } catch {
      // Silent fail
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`)
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {
      // Silent fail
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Container>
      <Tooltip title="Notifications">
        <StyledIconButton size="large" onClick={() => setIsOpen(!isOpen)}>
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                background: 'linear-gradient(135deg, #FF4C6A 0%, #FF6B9D 100%)',
                fontSize: '0.7rem',
                minWidth: 18,
                height: 18,
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </StyledIconButton>
      </Tooltip>

      {isOpen && (
        <DropdownPanel>
          <PanelHeader>
            <PanelTitle>Notifications</PanelTitle>
            {unreadCount > 0 && (
              <UnreadBadge>{unreadCount} new</UnreadBadge>
            )}
          </PanelHeader>
          <NotificationList>
            {notifications.length === 0 && (
              <EmptyState>No notifications yet</EmptyState>
            )}
            {notifications.map(notif => (
              <NotificationItem key={notif.id} isRead={notif.isRead}>
                <NotifContent>
                  <NotifMessage>{notif.message}</NotifMessage>
                  <NotifTime>
                    {new Date(notif.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </NotifTime>
                </NotifContent>
                {!notif.isRead && (
                  <Tooltip title="Mark as read">
                    <MarkReadButton size="small" onClick={() => markAsRead(notif.id)}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                    </MarkReadButton>
                  </Tooltip>
                )}
              </NotificationItem>
            ))}
          </NotificationList>
        </DropdownPanel>
      )}
    </Container>
  )
}

const Container = styled('div')`
  position: relative;
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

const DropdownPanel = styled('div')`
  position: absolute;
  top: 48px;
  right: -40px;
  width: 340px;
  max-height: 440px;
  background: ${alpha('#131738', 0.95)};
  backdrop-filter: blur(24px);
  border: 1px solid ${alpha('#6C63FF', 0.15)};
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 24px 48px -12px ${alpha('#000', 0.4)};
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const PanelHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${alpha('#6C63FF', 0.1)};
`

const PanelTitle = styled(Typography)`
  font-weight: 700;
  font-size: 1rem;
  color: #E8E8F0;
`

const UnreadBadge = styled('span')`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 8px;
  background: ${alpha('#FF6B9D', 0.15)};
  color: #FF6B9D;
`

const NotificationList = styled('div')`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${alpha('#6C63FF', 0.2)};
    border-radius: 2px;
  }
`

const NotificationItem = styled('div')<{ isRead: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: ${props => (props.isRead ? 'transparent' : alpha('#6C63FF', 0.06))};
  border-left: ${props => (props.isRead ? 'none' : `3px solid #6C63FF`)};

  &:hover {
    background: ${alpha('#6C63FF', 0.08)};
  }
`

const NotifContent = styled('div')`
  flex: 1;
  min-width: 0;
`

const NotifMessage = styled(Typography)`
  font-size: 0.85rem;
  color: #E8E8F0;
  line-height: 1.4;
`

const NotifTime = styled(Typography)`
  font-size: 0.7rem;
  color: #9B9BB4;
  margin-top: 2px;
`

const MarkReadButton = styled(IconButton)`
  color: #9D97FF;
  padding: 4px;
  &:hover {
    color: #00D68F;
    background: ${alpha('#00D68F', 0.1)};
  }
`

const EmptyState = styled(Typography)`
  color: #9B9BB4;
  text-align: center;
  padding: 24px;
  font-size: 0.85rem;
`

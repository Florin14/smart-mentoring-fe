import React, { useEffect, useState } from 'react'
import {
  alpha,
  Avatar,
  Button,
  styled,
  Typography,
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CampaignIcon from '@mui/icons-material/Campaign'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../account/selectors'
import { axiosInstance } from '../../api'
import { paths } from '../../api'
import { Role } from '../../types/User'

interface DashboardStats {
  assignmentsCount: number
  appointmentsCount: number
  announcementsCount: number
  unreadNotifications: number
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const userData = useAppSelector(selectUserData)
  const role = localStorage.getItem('authorities')
  const [stats, setStats] = useState<DashboardStats>({
    assignmentsCount: 0,
    appointmentsCount: 0,
    announcementsCount: 0,
    unreadNotifications: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [assignRes, appointRes, annRes, notifRes] = await Promise.allSettled([
        axiosInstance.get('/assignments'),
        axiosInstance.get('/appointments'),
        axiosInstance.get('/announcements'),
        axiosInstance.get('/notifications/unread/count'),
      ])
      setStats({
        assignmentsCount: assignRes.status === 'fulfilled' ? (Array.isArray(assignRes.value.data) ? assignRes.value.data.length : 0) : 0,
        appointmentsCount: appointRes.status === 'fulfilled' ? (Array.isArray(appointRes.value.data) ? appointRes.value.data.length : 0) : 0,
        announcementsCount: annRes.status === 'fulfilled' ? (Array.isArray(annRes.value.data) ? annRes.value.data.length : 0) : 0,
        unreadNotifications: notifRes.status === 'fulfilled' ? (notifRes.value.data?.count ?? 0) : 0,
      })
    } catch {
      // Silent
    }
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <Container>
      <WelcomeSection>
        <WelcomeText>
          <GreetingText variant="h4">
            {greeting()}, <GradientName>{userData?.fullName || 'there'}</GradientName>
          </GreetingText>
          <SubText>
            {role === Role.MENTOR
              ? "Here's an overview of your mentoring activity"
              : "Track your learning progress and upcoming tasks"}
          </SubText>
        </WelcomeText>
        {role === Role.STUDENT && (
          <CTAButton variant="contained" onClick={() => navigate(paths.MENTOR_MATCHING)}>
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            Find a Mentor
          </CTAButton>
        )}
      </WelcomeSection>

      <StatsGrid>
        <StatCard onClick={() => navigate(paths.ASSIGNMENTS)}>
          <StatIcon gradient="linear-gradient(135deg, #6C63FF 0%, #9D97FF 100%)">
            <AssignmentIcon sx={{ fontSize: 24 }} />
          </StatIcon>
          <StatInfo>
            <StatNumber>{stats.assignmentsCount}</StatNumber>
            <StatLabel>Assignments</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard onClick={() => navigate(paths.APPOINTMENTS)}>
          <StatIcon gradient="linear-gradient(135deg, #FF6B9D 0%, #FFA3C4 100%)">
            <CalendarTodayIcon sx={{ fontSize: 24 }} />
          </StatIcon>
          <StatInfo>
            <StatNumber>{stats.appointmentsCount}</StatNumber>
            <StatLabel>Appointments</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard onClick={() => navigate(paths.ANNOUNCEMENTS)}>
          <StatIcon gradient="linear-gradient(135deg, #00D68F 0%, #00E6A0 100%)">
            <CampaignIcon sx={{ fontSize: 24 }} />
          </StatIcon>
          <StatInfo>
            <StatNumber>{stats.announcementsCount}</StatNumber>
            <StatLabel>Announcements</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon gradient="linear-gradient(135deg, #FFAA00 0%, #FFC44D 100%)">
            <TrendingUpIcon sx={{ fontSize: 24 }} />
          </StatIcon>
          <StatInfo>
            <StatNumber>{stats.unreadNotifications}</StatNumber>
            <StatLabel>New Notifications</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <SectionsGrid>
        <QuickActionsCard>
          <CardTitle>Quick Actions</CardTitle>
          <ActionsGrid>
            <ActionButton onClick={() => navigate(paths.CHAT)}>
              <ActionIcon gradient="linear-gradient(135deg, #6C63FF 0%, #9D97FF 100%)">
                <SchoolIcon sx={{ fontSize: 20 }} />
              </ActionIcon>
              <Typography sx={{ fontSize: '0.8rem', color: '#E8E8F0', fontWeight: 500 }}>
                Messages
              </Typography>
            </ActionButton>
            <ActionButton onClick={() => navigate(paths.PROFILE)}>
              <ActionIcon gradient="linear-gradient(135deg, #FF6B9D 0%, #FFA3C4 100%)">
                <StarIcon sx={{ fontSize: 20 }} />
              </ActionIcon>
              <Typography sx={{ fontSize: '0.8rem', color: '#E8E8F0', fontWeight: 500 }}>
                Profile
              </Typography>
            </ActionButton>
            <ActionButton onClick={() => navigate(paths.ASSIGNMENTS)}>
              <ActionIcon gradient="linear-gradient(135deg, #00D68F 0%, #00E6A0 100%)">
                <AssignmentIcon sx={{ fontSize: 20 }} />
              </ActionIcon>
              <Typography sx={{ fontSize: '0.8rem', color: '#E8E8F0', fontWeight: 500 }}>
                Assignments
              </Typography>
            </ActionButton>
            <ActionButton onClick={() => navigate(paths.ANNOUNCEMENTS)}>
              <ActionIcon gradient="linear-gradient(135deg, #FFAA00 0%, #FFC44D 100%)">
                <CampaignIcon sx={{ fontSize: 20 }} />
              </ActionIcon>
              <Typography sx={{ fontSize: '0.8rem', color: '#E8E8F0', fontWeight: 500 }}>
                Announcements
              </Typography>
            </ActionButton>
          </ActionsGrid>
        </QuickActionsCard>

        <TipsCard>
          <CardTitle>Tips for {role === Role.MENTOR ? 'Mentors' : 'Students'}</CardTitle>
          <TipsList>
            {role === Role.STUDENT ? (
              <>
                <TipItem>
                  <TipDot color="#6C63FF" />
                  <Typography sx={{ fontSize: '0.85rem', color: '#9B9BB4' }}>
                    Use the AI Mentor Matching to find your perfect mentor
                  </Typography>
                </TipItem>
                <TipItem>
                  <TipDot color="#FF6B9D" />
                  <Typography sx={{ fontSize: '0.85rem', color: '#9B9BB4' }}>
                    Submit assignments before the deadline for bonus points
                  </Typography>
                </TipItem>
                <TipItem>
                  <TipDot color="#00D68F" />
                  <Typography sx={{ fontSize: '0.85rem', color: '#9B9BB4' }}>
                    Check announcements regularly for new mentoring opportunities
                  </Typography>
                </TipItem>
                <TipItem>
                  <TipDot color="#FFAA00" />
                  <Typography sx={{ fontSize: '0.85rem', color: '#9B9BB4' }}>
                    Rate your mentors to help other students find great matches
                  </Typography>
                </TipItem>
              </>
            ) : (
              <>
                <TipItem>
                  <TipDot color="#6C63FF" />
                  <Typography sx={{ fontSize: '0.85rem', color: '#9B9BB4' }}>
                    Create detailed announcements to attract the right students
                  </Typography>
                </TipItem>
                <TipItem>
                  <TipDot color="#FF6B9D" />
                  <Typography sx={{ fontSize: '0.85rem', color: '#9B9BB4' }}>
                    Provide timely feedback on student submissions
                  </Typography>
                </TipItem>
                <TipItem>
                  <TipDot color="#00D68F" />
                  <Typography sx={{ fontSize: '0.85rem', color: '#9B9BB4' }}>
                    Schedule regular appointments to keep students engaged
                  </Typography>
                </TipItem>
                <TipItem>
                  <TipDot color="#FFAA00" />
                  <Typography sx={{ fontSize: '0.85rem', color: '#9B9BB4' }}>
                    Complete your profile to improve your match score with students
                  </Typography>
                </TipItem>
              </>
            )}
          </TipsList>
        </TipsCard>
      </SectionsGrid>
    </Container>
  )
}

export default DashboardPage

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px;
  gap: 28px;
  max-width: 1000px;
`

const WelcomeSection = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  background: linear-gradient(135deg, ${alpha('#6C63FF', 0.1)} 0%, ${alpha('#FF6B9D', 0.06)} 100%);
  border: 1px solid ${alpha('#6C63FF', 0.12)};
  border-radius: 24px;
`

const WelcomeText = styled('div')``

const GreetingText = styled(Typography)`
  color: #E8E8F0;
  font-weight: 700;
  letter-spacing: -0.01em;
`

const GradientName = styled('span')`
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const SubText = styled(Typography)`
  color: #9B9BB4;
  margin-top: 4px;
  font-size: 0.95rem;
`

const CTAButton = styled(Button)`
  display: flex;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  border-radius: 14px;
  white-space: nowrap;
  &:hover {
    background: linear-gradient(135deg, #7B73FF 0%, #FF7DAD 100%);
    box-shadow: 0 12px 30px -8px ${alpha('#6C63FF', 0.5)};
  }
`

const StatsGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
`

const StatCard = styled('div')`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: ${alpha('#131738', 0.6)};
  border: 1px solid ${alpha('#6C63FF', 0.08)};
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    border-color: ${alpha('#6C63FF', 0.2)};
    transform: translateY(-2px);
    box-shadow: 0 12px 24px -8px ${alpha('#6C63FF', 0.12)};
  }
`

const StatIcon = styled('div')<{ gradient: string }>`
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.gradient};
  color: white;
`

const StatInfo = styled('div')``

const StatNumber = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 800;
  color: #E8E8F0;
  line-height: 1;
`

const StatLabel = styled(Typography)`
  font-size: 0.8rem;
  color: #9B9BB4;
  margin-top: 2px;
`

const SectionsGrid = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`

const QuickActionsCard = styled('div')`
  padding: 24px;
  background: ${alpha('#131738', 0.5)};
  border: 1px solid ${alpha('#6C63FF', 0.08)};
  border-radius: 20px;
`

const CardTitle = styled(Typography)`
  font-weight: 700;
  font-size: 1rem;
  color: #E8E8F0;
  margin-bottom: 16px;
`

const ActionsGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`

const ActionButton = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${alpha('#6C63FF', 0.04)};
  border: 1px solid transparent;
  &:hover {
    background: ${alpha('#6C63FF', 0.08)};
    border-color: ${alpha('#6C63FF', 0.15)};
  }
`

const ActionIcon = styled('div')<{ gradient: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.gradient};
  color: white;
`

const TipsCard = styled('div')`
  padding: 24px;
  background: ${alpha('#131738', 0.5)};
  border: 1px solid ${alpha('#6C63FF', 0.08)};
  border-radius: 20px;
`

const TipsList = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const TipItem = styled('div')`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

const TipDot = styled('div')<{ color: string }>`
  width: 8px;
  height: 8px;
  min-width: 8px;
  border-radius: 50%;
  background: ${p => p.color};
  margin-top: 6px;
`

import React, { useState } from 'react'
import { alpha, css, keyframes, styled, Typography } from '@mui/material'
import { useAppSelector } from '../../redux/hooks'

import { LoginForm } from '../login/LoginForm'
import { RegistrationForm } from '../registration/RegistrationForm'
import { LoadingOverlay } from '../common/LoadingOverlay'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SchoolIcon from '@mui/icons-material/School'
import GroupsIcon from '@mui/icons-material/Groups'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

enum Mode {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
}

const WelcomePage: React.FC = () => {
  const [mode, setMode] = useState(Mode.LOGIN)

  const loginLoading = useAppSelector(state => state.appState.loginLoading)
  const registerLoading = useAppSelector(state => state.appState.registerLoading)
  const showLoading = loginLoading || registerLoading

  return (
    <Container>
      <LoadingOverlay visible={showLoading} />
      <BackgroundOrbs>
        <Orb1 />
        <Orb2 />
        <Orb3 />
      </BackgroundOrbs>
      <LeftSection>
        <LogoBadge>
          <AutoAwesomeIcon sx={{ fontSize: 20 }} />
          Smart Mentoring
        </LogoBadge>
        <HeroTitle variant="h2">
          {mode === Mode.LOGIN ? 'Welcome back!' : 'Find your perfect'}
          {mode === Mode.REGISTER && <GradientText> mentor</GradientText>}
        </HeroTitle>
        <HeroSubtitle variant="body1">
          {mode === Mode.LOGIN
            ? 'Sign in to continue your learning journey and connect with your mentors.'
            : 'Join thousands of students who found the right guidance to accelerate their growth.'}
        </HeroSubtitle>
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>
              <SchoolIcon sx={{ fontSize: 22 }} />
            </FeatureIcon>
            <FeatureText>
              <FeatureTitle>Personalized Learning</FeatureTitle>
              <FeatureDesc>Tailored assignments and feedback from expert mentors</FeatureDesc>
            </FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <GroupsIcon sx={{ fontSize: 22 }} />
            </FeatureIcon>
            <FeatureText>
              <FeatureTitle>Expert Mentors</FeatureTitle>
              <FeatureDesc>Connect with experienced professionals in your field</FeatureDesc>
            </FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <TrendingUpIcon sx={{ fontSize: 22 }} />
            </FeatureIcon>
            <FeatureText>
              <FeatureTitle>Track Progress</FeatureTitle>
              <FeatureDesc>Monitor your growth with detailed analytics and insights</FeatureDesc>
            </FeatureText>
          </FeatureItem>
        </FeatureList>
      </LeftSection>
      <RightSection>
        <FormCard>
          <Layer visible={mode === Mode.LOGIN}>
            <LoginForm registerClick={() => setMode(Mode.REGISTER)} />
          </Layer>
          <Layer visible={mode === Mode.REGISTER}>
            <RegistrationForm loginClick={() => setMode(Mode.LOGIN)} />
          </Layer>
        </FormCard>
      </RightSection>
    </Container>
  )
}

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(2deg); }
  66% { transform: translateY(10px) rotate(-1deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`

const Container = styled('div')`
  display: flex;
  min-height: 100vh;
  background: #0A0E27;
  position: relative;
  overflow: hidden;
  padding: 40px;
  gap: 60px;
  align-items: center;
  justify-content: center;

  @media (max-width: 960px) {
    flex-direction: column;
    padding: 20px;
    gap: 30px;
  }
`

const BackgroundOrbs = styled('div')`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`

const Orb1 = styled('div')`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, ${alpha('#6C63FF', 0.15)} 0%, transparent 70%);
  top: -200px;
  left: -200px;
  animation: ${pulse} 8s ease-in-out infinite;
`

const Orb2 = styled('div')`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, ${alpha('#FF6B9D', 0.12)} 0%, transparent 70%);
  bottom: -150px;
  right: -100px;
  animation: ${pulse} 10s ease-in-out infinite 2s;
`

const Orb3 = styled('div')`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, ${alpha('#00D68F', 0.1)} 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${pulse} 6s ease-in-out infinite 4s;
`

const LeftSection = styled('div')`
  display: flex;
  flex-direction: column;
  max-width: 520px;
  z-index: 1;

  @media (max-width: 960px) {
    align-items: center;
    text-align: center;
    max-width: 100%;
  }
`

const LogoBadge = styled('div')`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 50px;
  background: ${alpha('#6C63FF', 0.1)};
  border: 1px solid ${alpha('#6C63FF', 0.2)};
  color: #9D97FF;
  font-weight: 600;
  font-size: 0.85rem;
  width: fit-content;
  margin-bottom: 24px;
`

const HeroTitle = styled(Typography)`
  color: #E8E8F0;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
`

const GradientText = styled('span')`
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const HeroSubtitle = styled(Typography)`
  color: #9B9BB4;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 440px;
`

const FeatureList = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 960px) {
    display: none;
  }
`

const FeatureItem = styled('div')`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: ${alpha('#6C63FF', 0.06)};
  }
`

const FeatureIcon = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${alpha('#6C63FF', 0.15)} 0%, ${alpha('#FF6B9D', 0.1)} 100%);
  color: #9D97FF;
`

const FeatureText = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const FeatureTitle = styled(Typography)`
  color: #E8E8F0;
  font-weight: 600;
  font-size: 0.95rem;
`

const FeatureDesc = styled(Typography)`
  color: #9B9BB4;
  font-size: 0.85rem;
`

const RightSection = styled('div')`
  display: flex;
  position: relative;
  z-index: 1;
`

const FormCard = styled('div')`
  animation: ${float} 12s ease-in-out infinite;
`

const Layer = styled('div')<{ visible?: boolean }>`
  ${props =>
    !props.visible &&
    css`
      display: none;
    `}
`

export default WelcomePage

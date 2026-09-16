import React from 'react'
import { alpha, Box, Button, styled, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Container>
      <ErrorCode variant="h1">404</ErrorCode>
      <Title variant="h4">Page not found</Title>
      <Subtitle variant="body1">
        The page you're looking for doesn't exist or has been moved.
      </Subtitle>
      <HomeButton variant="contained" onClick={() => navigate('/')}>
        Go Home
      </HomeButton>
    </Container>
  )
}

const Container = styled(Box)`
  height: 100vh;
  width: 100%;
  background: #0A0E27;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`

const ErrorCode = styled(Typography)`
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
`

const Title = styled(Typography)`
  color: #E8E8F0;
  font-weight: 700;
`

const Subtitle = styled(Typography)`
  color: #9B9BB4;
  margin-bottom: 16px;
`

const HomeButton = styled(Button)`
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  padding: 12px 32px;
  &:hover {
    background: linear-gradient(135deg, #7B73FF 0%, #FF7DAD 100%);
    box-shadow: 0 12px 30px -8px ${alpha('#6C63FF', 0.5)};
  }
`

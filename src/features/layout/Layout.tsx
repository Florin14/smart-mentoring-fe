import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { LoadingScreen } from '../application/utils'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { displaySnackbar } from '../application/slice'
import { styled } from '@mui/material'
import { Sidebar } from '../common/Sidebar'
import { paths } from '../../api'
import { NavBar } from '../common/Navbar'
import { selectUserData } from '../account/selectors'
import { fetchUserData } from '../account/actions'

export const Layout: React.FC = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = !!localStorage.getItem('jwtToken')

  const userData = useAppSelector(selectUserData)
  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserData())
    }
  }, [userData])

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(
        displaySnackbar({
          open: true,
          type: 'warning',
          message: 'You do not have permission to access this page',
        })
      )
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate to={paths.LANDING_PAGE} />
  }

  return (
    <LoadingScreen>
      <Page>
        <NavBar />
        <Content>
          <Sidebar />
          <MainContent>
            <Outlet />
          </MainContent>
        </Content>
      </Page>
    </LoadingScreen>
  )
}

const Page = styled('div')`
  width: 100%;
  min-height: 100vh;
  background: #0A0E27;
`

const Content = styled('div')`
  width: 92%;
  max-width: 1400px;
  display: flex;
  margin: 0 auto;
  padding-top: 88px;
  gap: 24px;
`

const MainContent = styled('div')`
  flex: 1;
  min-width: 0;
`

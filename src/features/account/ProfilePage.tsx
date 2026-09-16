import React, { useEffect, useState } from 'react'
import { alpha, Autocomplete, Button, css, styled, Tab, Tabs, TextField, Typography } from '@mui/material'
import { UserDto } from '../../types/User'
import { SubmitHandler, useForm, FormProvider, useController } from 'react-hook-form'
import { LoadingOverlay } from '../common/LoadingOverlay'
import { dateMatchRegexp } from './utils'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import {
  selectCompletedStudiesOptions,
  selectCompletedStudiesOptionsLoading,
  selectInterestAreasOptions,
  selectInterestAreasOptionsLoading,
  selectUpdateUserLoading,
  selectUserAvatar,
  selectUserAvatarLoading,
  selectUserData,
  selectUserDataLoading,
} from './selectors'
import { FormInput, ReadOnlyFormInput } from '../common/FormInput'
import { ProfilePicture } from './ProfilePicture'
import { Section, useSectionScroll } from './hooks'
import {
  fetchCompletedStudiesOptions,
  fetchInterestAreasOptions,
  fetchUserAvatar,
  fetchUserData,
  updateUserData,
} from './actions'

export type ProfileFormType = Omit<UserDto, 'email' | 'role' | 'profilePicture'> & {
  profilePicture?: File
  password: string
}

export type ProfileSubmitType = Omit<
  UserDto,
  'email' | 'role' | 'profilePicture' | 'completedStudies' | 'interestAreas'
> & {
  profilePicture?: File
  completedStudyIds?: number[]
  interestAreaIds?: number[]
  ongoingStudyId?: number
  password?: string
}

const ProfilePage: React.FC = () => {
  const formMethods = useForm<ProfileFormType>()
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = formMethods
  const { generalSectionRef, profileSectionRef, activeSection, handleSectionChange } = useSectionScroll()
  const dispatch = useAppDispatch()

  const userData = useAppSelector(selectUserData)
  const userDataLoading = useAppSelector(selectUserDataLoading)

  const userAvatarLoading = useAppSelector(selectUserAvatarLoading)

  const updateUserLoading = useAppSelector(selectUpdateUserLoading)

  const completedStudiesOptions = useAppSelector(selectCompletedStudiesOptions)
  const completedStudiesOptionsLoading = useAppSelector(selectCompletedStudiesOptionsLoading)

  const interestAreasOptions = useAppSelector(selectInterestAreasOptions)
  const interestAreasOptionsLoading = useAppSelector(selectInterestAreasOptionsLoading)
  const [init, setInit] = useState<boolean>(false)

  useEffect(() => {
    // if (!init) {
    // dispatch(fetchUserData())
    dispatch(fetchUserAvatar())
    dispatch(fetchInterestAreasOptions())
  }, [])

  const handleSaveProfile: SubmitHandler<ProfileFormType> = formData => {
    const parsedCompletedStudies = formData['completedStudies']?.map(s => s.id) || []
    const parsedInterestAreas = formData['interestAreas']?.map(ia => ia.id) || []
    const parsedOngoingStudy = formData['ongoingStudy']?.id || undefined
    const parsedPassword = formData['password'] === '' ? undefined : formData['password']

    const submittedData: ProfileSubmitType = {
      ...formData,
      completedStudyIds: parsedCompletedStudies,
      interestAreaIds: parsedInterestAreas,
      ongoingStudyId: parsedOngoingStudy,
      password: parsedPassword,
    }

    dispatch(updateUserData(submittedData))
  }

  const { field: ongoingStudyField } = useController({ name: 'ongoingStudy', control })
  const { field: completedStudiesField } = useController({ name: 'completedStudies', control })
  const { field: interestAreasField } = useController({ name: 'interestAreas', control })

  const ongoingStudyValue = formMethods.watch('ongoingStudy')
  const completeStudiesValue = formMethods.watch('completedStudies')
  const interestAreasValue = formMethods.watch('interestAreas')

  const isPageLoading =
    userDataLoading ||
    userAvatarLoading ||
    updateUserLoading ||
    completedStudiesOptionsLoading ||
    interestAreasOptionsLoading

  return (
    <Container>
      <LoadingOverlay visible={isPageLoading} />
      <FormTitle variant="overline">Profile</FormTitle>
      <FormProvider {...formMethods}>
        <FormWrapper onSubmit={handleSubmit(handleSaveProfile)}>
          <PictureSection>
            <ProfilePicture />
            <PictureSubtitle variant="overline">Upload a photo</PictureSubtitle>
          </PictureSection>
          <FormSection ref={generalSectionRef} id={Section.GENERAL.toString()}>
            <FormSubtitle variant="overline">General</FormSubtitle>
            <ReadOnlyFormInput label="Email" value={userData?.email || ''} />
            <FormInput
              label="Full Name"
              fieldName="fullName"
              options={{
                minLength: {
                  value: 3,
                  message: 'Full name should be min 3 characters long',
                },
              }}
              placeholder={userData?.fullName}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
            <FormInput
              label="New Password"
              fieldName={'password'}
              options={{
                minLength: {
                  value: 6,
                  message: 'Password too short',
                },
              }}
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </FormSection>
          <FormSection ref={profileSectionRef} id={Section.PROFILE.toString()}>
            <FormSubtitle variant="overline">Profile</FormSubtitle>
            <FormInput
              label="Birth Date"
              fieldName="birthdate"
              options={{ pattern: { value: dateMatchRegexp, message: 'Wrong Date Format' } }}
              error={!!errors.birthdate}
              helperText="Date format: DD-MM-YYYY"
            />
            <Autocomplete
              autoHighlight
              options={completedStudiesOptions || []}
              getOptionLabel={option => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={ongoingStudyValue || null}
              renderInput={params => (
                <TextField
                  {...params}
                  helperText={errors.ongoingStudy?.message}
                  error={!!errors.ongoingStudy}
                  label="Ongoing Study"
                  InputLabelProps={{ shrink: true }}
                  color="secondary"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
              onChange={(_, newOngoingStudy) => {
                formMethods.clearErrors('ongoingStudy')
                if (!newOngoingStudy) {
                  formMethods.setError('ongoingStudy', new Error('Required field!'))
                }

                ongoingStudyField.onChange(newOngoingStudy, { shouldDirty: true })
                ongoingStudyField.onBlur()
              }}
            />
            <Autocomplete
              multiple
              options={completedStudiesOptions || []}
              getOptionLabel={option => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={completeStudiesValue ?? []}
              filterSelectedOptions
              renderInput={params => (
                <TextField
                  {...params}
                  helperText={errors.completedStudies?.message}
                  error={!!errors.completedStudies}
                  color="secondary"
                  InputLabelProps={{ shrink: true }}
                  label="Completed Studies"
                />
              )}
              onChange={(_, newCompletedStudies) => {
                formMethods.clearErrors('completedStudies')
                if (newCompletedStudies.length < 1) {
                  formMethods.setError('completedStudies', new Error('Must have 1 selected'))
                }

                completedStudiesField.onChange(newCompletedStudies, { shouldDirty: true })
                completedStudiesField.onBlur()
              }}
            />
            <Autocomplete
              multiple
              options={interestAreasOptions || []}
              getOptionLabel={option => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={interestAreasValue ?? []}
              filterSelectedOptions
              renderInput={params => (
                <TextField
                  {...params}
                  helperText={errors.interestAreas?.message}
                  error={!!errors.interestAreas}
                  color="secondary"
                  InputLabelProps={{ shrink: true }}
                  label="Interest Areas"
                />
              )}
              onChange={(_, newInterestAreas) => {
                formMethods.clearErrors('interestAreas')
                if (newInterestAreas.length < 1) {
                  formMethods.setError('interestAreas', new Error('Must have 1 selected'))
                }

                interestAreasField.onChange(newInterestAreas)
                interestAreasField.onBlur()
              }}
            />
            <FormInput
              label="Description"
              fieldName="description"
              options={{ maxLength: 200 }}
              helperText="Max 200 characters"
              multiline
              rows={3}
            />
          </FormSection>

          <SaveButton
            variant="contained"
            color="secondary"
            type="submit"
            disabled={!isDirty || !!Object.values(errors).length}
          >
            Update Profile
          </SaveButton>
        </FormWrapper>
      </FormProvider>
      <TabsWrapper>
        <Typography variant="overline">Sections</Typography>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={activeSection}
          onChange={handleSectionChange}
          sx={{ borderLeft: 1, borderColor: 'divider' }}
          TabIndicatorProps={{ sx: { left: 0 } }}
          indicatorColor="secondary"
        >
          <SectionTab label="GENERAL" aria-selected={activeSection === Section.GENERAL} />
          <SectionTab label="PROFILE" aria-selected={activeSection === Section.PROFILE} />
        </Tabs>
      </TabsWrapper>
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 24px;
`

const FormTitle = styled(Typography)`
  font-weight: 700;
  font-size: 28px;
  color: #E8E8F0;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
`

const FormSubtitle = styled(Typography)`
  font-weight: 600;
  margin-bottom: 16px;
  color: #9D97FF;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
`

const FormWrapper = styled('form')`
  padding: 32px;
  width: 55%;
  background: ${alpha('#131738', 0.5)};
  border: 1px solid ${alpha('#6C63FF', 0.1)};
  border-radius: 24px;
  backdrop-filter: blur(12px);

  @media (max-width: 960px) {
    width: 100%;
  }
`

const FormSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 24px 0;
  padding: 24px;
  background: ${alpha('#6C63FF', 0.03)};
  border-radius: 16px;
  border: 1px solid ${alpha('#6C63FF', 0.06)};
`

const SaveButton = styled(Button)`
  color: white;
  padding: 12px 32px;
  font-size: 0.95rem;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  &:hover {
    background: linear-gradient(135deg, #7B73FF 0%, #FF7DAD 100%);
    box-shadow: 0 12px 30px -8px ${alpha('#6C63FF', 0.5)};
  }
`

const PictureSection = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`

const PictureSubtitle = styled(Typography)`
  font-weight: 500;
  color: #9B9BB4;
  font-size: 0.8rem;
`

const TabsWrapper = styled('div')`
  position: fixed;
  right: 10%;
  top: 100px;
  background: ${alpha('#131738', 0.6)};
  border: 1px solid ${alpha('#6C63FF', 0.1)};
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(12px);

  @media (max-width: 1200px) {
    display: none;
  }
`

const SectionTab = styled(Tab)`
  color: #9B9BB4;
  ${props =>
    props['aria-selected'] &&
    css`
      color: #6C63FF !important;
    `}
`

export default ProfilePage

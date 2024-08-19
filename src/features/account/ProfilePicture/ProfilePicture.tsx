import React, { useEffect, useRef, useState } from 'react'
import { styled } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { initialPictureURL } from '../utils'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { updateUserData } from '../actions'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectUserAvatar } from '../selectors'
import { updateAvatar } from '../slice'

export const ProfilePicture: React.FC = () => {
  const dispatch = useAppDispatch()
  const pictureRef = useRef<HTMLInputElement>(null)
  const userAvatar = useAppSelector(selectUserAvatar)

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0]

      const submittedData = {
        profilePicture: imageFile,
      }

      dispatch(updateUserData(submittedData))
      dispatch(updateAvatar({ profilePicture: imageFile }))
    }
  }

  const getPictureSrc = () => {
    if (!userAvatar) {
      return initialPictureURL
    }
    if (userAvatar instanceof File || typeof userAvatar == 'string') {
      return userAvatar instanceof File ? URL.createObjectURL(userAvatar) : `data:image/jpeg;base64,${userAvatar}`
    }

    return initialPictureURL
  }

  return (
    <>
      <PictureWrapper onClick={() => pictureRef.current?.click()}>
        <PictureHoverIcon id="image-upload-icon" />
        <Picture src={getPictureSrc()} />
      </PictureWrapper>
      <PictureInput ref={pictureRef} type="file" accept="image/png, image/jpeg" onChange={handlePictureUpload} />
    </>
  )
}

const PictureWrapper = styled('div')`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  transition: opacity 0.15s ease-in-out;

  :hover {
    opacity: 0.4;
    cursor: pointer;

    #image-upload-icon {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
`

const PictureHoverIcon = styled(AddPhotoAlternateIcon)`
  opacity: 0;
  position: absolute;
  align-self: center;
  width: 45px;
  height: 45px;
  color: #ddd;
  transition: all 0.15s ease-in-out;
`

const Picture = styled('img')`
  object-fit: cover;
  width: 150px;
  height: 150px;
`

const PictureInput = styled('input')`
  display: none;
`

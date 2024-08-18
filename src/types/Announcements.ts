import { Dayjs } from 'dayjs'
import { InterestAreasResponseDTO } from './InterestAreas'

export interface AnnouncementUserResponseDTO {
  id: number
  fullName: string
  avatar: string
}

export interface Announcement {
  id: number
  title: string
  postingDate: Dayjs
  user: AnnouncementUserResponseDTO
  interestAreas: InterestAreasResponseDTO
  description: string
  price: number
}

export interface AnnouncementDto {
  id: number
  title: string
  postingDate: Date
  user: AnnouncementUserResponseDTO
  interestAreas: InterestAreasResponseDTO
  description: string
  price: number
}

export interface Submission {
  userId: number | undefined
  title: string
  interestAreasId: number | null
  description: string
  price: number
}

export interface UpdateSubmission {
  id: number
  userId: number | undefined
  title: string
  interestAreasId: number | null
  description: string
  price: number
}

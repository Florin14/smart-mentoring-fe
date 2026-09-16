export enum Role {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
}

export interface Study {
  id: number
  name: string
}

export interface InterestArea {
  id: number
  name: string
}

export interface BaseUser {
  id: number
  fullName: string
  email: string
  role: Role
}

export interface User extends BaseUser {
  profilePicture: File | string
  completedStudies: Study[]
  ongoingStudy: Study
  interestAreas: InterestArea[]
  description: string
  birthdate: string
}

export interface UserAvatar {
  profilePicture: File | string
}

export type UserDto = Partial<User>

export interface RegisterUserDTO {
  fullName: string
  email: string
  password: string
  role: Role
}

export interface LoginUserDTO {
  email: string
  password: string
}

export interface LoginResponseBody {
  token: string
  email: string
  role: string
}

export interface AuthProps {
  jwtToken: string
  email: string
  authorities: string[]
}

import { Response } from '../../types/Response'
import { AssignmentRequestDto, AssignmentResponseDto } from '../../types/Assignment'
import { AxiosResponse } from 'axios'
import { axiosInstance } from '../../api'
import { BaseUser } from '../../types/User'
import { mockAssignments } from '../assignments/mock-objects'

type mockAxiosResponse<T> = {
  data: T
}

const mockAssignmentResponse: mockAxiosResponse<Response<AssignmentResponseDto[]>> = {
  data: {
    data: mockAssignments,
    error: undefined,
  },
}

export const fetchAssignmentsCallMock = async (): Promise<mockAxiosResponse<Response<AssignmentResponseDto[]>>> =>
  mockAssignmentResponse

export const fetchAssignmentsCall = async (): Promise<AxiosResponse<Response<AssignmentResponseDto[]>>> =>
  axiosInstance.get('/assignments')

export const fetchMentorStudentsCall = async (): Promise<AxiosResponse<Response<BaseUser[]>>> =>
  axiosInstance.get('/mentors/appointments/students')

export const createAssignmentCall = async (
  assignment: AssignmentRequestDto
): Promise<AxiosResponse<AssignmentResponseDto>> => axiosInstance.post('/assignments', assignment)

export const updateAssignmentCall = async ({
  assignment,
  assignmentId,
}: {
  assignment: AssignmentRequestDto
  assignmentId: number
}): Promise<AxiosResponse<AssignmentResponseDto>> => axiosInstance.put(`/assignments/${assignmentId}`, assignment)

export const deleteAssignmentCall = async (assignmentId: number): Promise<AxiosResponse<number>> =>
  axiosInstance.delete(`/assignments/${assignmentId}`)

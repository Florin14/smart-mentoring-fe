import { AssignmentRequestDto, AssignmentResponseDto } from '../../types/Assignment'
import { AxiosResponse } from 'axios'
import { axiosInstance } from '../../api'
import { BaseUser } from '../../types/User'

export const fetchAssignmentsCall = async (): Promise<AxiosResponse<AssignmentResponseDto[]>> =>
  axiosInstance.get('/assignments')

export const fetchMentorStudentsCall = async (): Promise<AxiosResponse<BaseUser[]>> =>
  axiosInstance.get('/users/mentors/appointments/students')

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

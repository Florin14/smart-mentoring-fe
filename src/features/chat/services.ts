import { AxiosResponse } from 'axios'
import { axiosInstance } from '../../api'

export const fetchMessagesCall = async (receiverId: number): Promise<AxiosResponse<any[]>> =>
  axiosInstance.get(`/messages?receiver_id=${receiverId}`)

export const sendMessageCall = async (message: { receiver_id: number; content: string }): Promise<AxiosResponse<any>> =>
  axiosInstance.post('/messages', message)

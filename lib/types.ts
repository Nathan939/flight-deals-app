export type Plan = 'free' | 'sms'

export interface DealData {
  id?: string
  from: string
  fromCity?: string
  to: string
  toCity?: string
  price: number
  originalPrice: number
  currency: string
  dates?: string
  url?: string
  discount: number
  createdAt?: Date
  expiresAt?: Date | null
}

export interface UserData {
  id: string
  email: string
  name?: string | null
  subscription?: {
    plan: string
    status: string
  }
}

export interface DestinationData {
  id: string
  city: string
  country: string
  code: string
}

export interface AlertData {
  id: string
  deal: DealData
  sent: boolean
  sentAt?: Date | null
  channel: string
  createdAt: Date
}

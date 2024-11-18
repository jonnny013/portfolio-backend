import z from 'npm:zod'
import { AboutMeParser, ContactFormParser, ProjectParser } from './utils/parsers.ts'

export type ProjectType = z.infer<typeof ProjectParser>

export type ProjectWithoutID = Omit<ProjectType, 'id'>

export type NewProject = Omit<ProjectType, 'id' | 'dateAdded'>

export type NewEmail = z.infer<typeof ContactFormParser>

export interface LoginRecord {
  time: string
  ipAddress: string
  device: string
}

export interface AccountStatus {
  active: boolean
  locked: boolean
  failedLoginAttempts: number
}

export interface UserType {
  _id?: string
  username: string
  password: string
  dateAdded: string
  loginRecord: LoginRecord[]
  accountStatus: AccountStatus
  id: string
}

export type NewUser = Omit<UserType, 'id' | 'dateAdded' | 'loginRecord' | 'accountStatus'>

export type AboutMeType = z.infer<typeof AboutMeParser>

export type NewAboutMeType = Omit<AboutMeType, 'id' | 'dateAdded'>

export type AboutMeWithoutID = Omit<AboutMeType, 'id'>

export interface Session {
  id: number
  dateCreated: number
  username: string
  issued: number
  expires: number
}

export type PartialSession = Omit<Session, 'issued' | 'expires'>

export interface EncodeResult {
  token: string
  expires: number
  issued: number
}

export type DecodeResult =
  | {
      type: 'valid'
      session: Session
    }
  | {
      type: 'integrity-error'
    }
  | {
      type: 'invalid-token'
    }

export type ExpirationStatus = 'expired' | 'active' | 'grace'

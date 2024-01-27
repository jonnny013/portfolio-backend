export interface ProjectType {
  id: string
  title: string
  project: string
  description: string
  skills: Skills
  website: string
  sourceCode?: string
  dateAdded: string
  recommended: boolean
}

export interface Skills {
    css: boolean
    html: boolean
    node: boolean
    react: boolean
    bootstrap: boolean
    materialUI: boolean
    mongoDB: boolean
    express: boolean
    javascript: boolean
    typescript: boolean
}

export type ProjectWithoutID = Omit<ProjectType, 'id'>

export type NewProject = Omit<ProjectType, 'id' | 'dateAdded'>

export interface ContactFormType {
  name: string
  email: string
  subject: string
  message: string
  dateAdded: string
}

export type NewEmail = Omit<ContactFormType, 'dateAdded'>

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

export type NewUser = Omit<UserType, 'id' | 'dateAdded' | 'loginRecord' | 'accountStatus' >

export enum AboutMeInfoType {
  Certificate = 'Certificate',
  Personal = 'Personal',
  Experience = 'Experience',
}

export interface AboutMeType {
  picture:  string 
  name: string
  description: string
  id: string
  picDesc: string
  type: AboutMeInfoType
  dateAdded: string
}

export type NewAboutMeType = Omit<AboutMeType, 'id' | 'dateAdded'>

export type AboutMeWithoutID = Omit<AboutMeType, 'id'>

export interface Session {
  id: number
  dateCreated: number
  username: string
  /**
   * Timestamp indicating when the session was created, in Unix milliseconds.
   */
  issued: number
  /**
   * Timestamp indicating when the session should expire, in Unix milliseconds.
   */
  expires: number
}

/**
 * Identical to the Session type, but without the `issued` and `expires` properties.
 */
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
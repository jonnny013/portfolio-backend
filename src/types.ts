export interface ProjectType {
  id: string
  title: string
  project: string
  description: string
  skills: Skills
  website: string
  sourceCode: string
  dateAdded: string
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

export interface LoginRecord {
  time: string
  ipAddress: string
}

export interface AccountStatus {
  active: boolean
  locked: boolean
}

export interface UserType {
  username: string
  password: string
  dateAdded: string
  loginRecord: LoginRecord[]
  accountStatus: AccountStatus
  id: string
}

export type NewUser = Omit<UserType, 'id' | 'dateAdded' | 'loginRecord' | 'accountStatus'>

export type SafeUserInfo = Omit<UserType, 'dateAdded' | 'loginRecord' | 'accountStatus'>

export enum AboutMeInfoType {
  Certificate = 'Certificate',
  Personal = 'Personal',
  Experience = 'Experience',
}

export interface AboutMeType {
  picture: HTMLImageElement | File | string
  name: string
  description: string
  id: string
  picDesc: string
  type: AboutMeInfoType
  dateAdded: string
}

export type NewAboutMeType = Omit<AboutMeType, 'id' | 'dateAdded'>

export type AboutMeWithoutID = Omit<AboutMeType, 'id'>

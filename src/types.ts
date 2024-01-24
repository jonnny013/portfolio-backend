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

export interface UserType {
  username: string
  password: string
  dateAdded: string
  id: string
}

export type NewUser = Omit<UserType, 'id' | 'dateAdded'>

export type UserWithoutId = Omit<UserType, 'id'>

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
}

export type NewAboutMeType = Omit<ProjectType, 'id' | 'dateAdded'>

export type AboutMeWithoutID = Omit<AboutMeType, 'id'>

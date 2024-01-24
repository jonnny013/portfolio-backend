export interface ProjectType {
  id: string
  title: string
  project: string
  description: string
  skills: {
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
  website: string
  sourceCode: string
  dateAdded: string
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

export interface AboutMeType {
  picture: HTMLImageElement | File | string
  name: string
  description: string
  id: string
  picDesc: string
  dateAdded: string
}

export type NewAboutMeType = Omit<ProjectType, 'id' | 'dateAdded'>

export type AboutMeWithoutID = Omit<AboutMeType, 'id'>

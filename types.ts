export interface Project {
  id: string
  title: string
  project: string
  intro: string
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

export type ProjectWithoutID = Omit<Project, 'id'>

export interface ContactFormTypes {
  name: string
  email: string
  subject: string
  message: string
  dateAdded: string
}

export interface User {
  username: string
  password: string
}

export interface AboutMe {
  picture: HTMLImageElement | File | string
  name: string
  description: string
  id: string
  picDesc: string
  dateAdded: string
}

export type AboutMeWithoutID = Omit<AboutMe, 'id'>

import { NewUser } from "../types"

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String
}

const parseString = (item: unknown, name: string): string => {
  if (!item || !isString(item)) {
    throw new Error(`Incorrect or missing ${name}`)
  }
  return item
}

/* const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date))
}

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date)
  }
  return date
} */

const parseUserData = (object: unknown): NewUser => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data')
  }
  if ('username' in object && 'password' in object) {
    const newUser: NewUser = {
      username: parseString(object.username, 'username'),
      password: parseString(object.password, 'password'),
    }
    return newUser
  }
  throw new Error('Incorrect data: some fields are missing')
}

const parseProjectData = (object: unknown): NewProject => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data')
  }
  if ('username' in object && 'password' in object) {
    const newUser: NewUser = {
      username: parseString(object.username, 'username'),
      password: parseString(object.password, 'password'),
    }
    return newUser
  }
  throw new Error('Incorrect data: some fields are missing')
}

export default {parseUserData, parseProjectData}
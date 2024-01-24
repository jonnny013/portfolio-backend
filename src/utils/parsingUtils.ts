import { NewProject, NewUser, ProjectType, Skills } from '../types'

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String
}

const parseString = (item: unknown, name: string): string => {
  if (!item || !isString(item)) {
    throw new Error(`Incorrect or missing ${name}`)
  }
  return item
}

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date))
}

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date)
  }
  return date
}

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

const isBoolean = (boolean: unknown): boolean is boolean => {
  return typeof boolean === 'boolean' || boolean instanceof Boolean
}

const parseBoolean = (item: unknown, name: string): boolean => {
  console.log('item:', item, '. name:', name)
  if (!isBoolean(item)) {
    throw new Error(`Incorrect or missing ${name}`)
  }
  return item
}

const parseObject = (object: unknown) => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data')
  }
  return object
}

const parseSkills = (startingObject: unknown): Skills => {
  const object = parseObject(startingObject)
  if (
    'css' in object &&
    'html' in object &&
    'node' in object &&
    'react' in object &&
    'bootstrap' in object &&
    'materialUI' in object &&
    'mongoDB' in object &&
    'express' in object &&
    'javascript' in object &&
    'typescript' in object
  ) {
    const skills = {
      css: parseBoolean(object.css, 'css'),
      html: parseBoolean(object.html, 'html'),
      node: parseBoolean(object.node, 'node'),
      react: parseBoolean(object.react, 'react'),
      bootstrap: parseBoolean(object.bootstrap, 'bootstrap'),
      materialUI: parseBoolean(object.materialUI, 'materialUI'),
      mongoDB: parseBoolean(object.mongoDB, 'mongoDB'),
      express: parseBoolean(object.express, 'express'),
      javascript: parseBoolean(object.javascript, 'javascript'),
      typescript: parseBoolean(object.typescript, 'typescript'),
    }
    return skills
  }
  throw new Error('Incorrect skills: some fields are missing')
}

const parseNewProjectData = (startingObject: unknown): NewProject => {
  const object = parseObject(startingObject)

  if (
    'title' in object &&
    'project' in object &&
    'description' in object &&
    'website' in object &&
    'sourceCode' in object &&
    'skills' in object
  ) {
    const newProject: NewProject = {
      title: parseString(object.title, 'title'),
      project: parseString(object.project, 'project'),
      description: parseString(object.description, 'description'),
      website: parseString(object.website, 'website'),
      sourceCode: parseString(object.sourceCode, 'sourceCode'),
      skills: parseSkills(object.skills),
    }
    return newProject
  }
  throw new Error('Incorrect data: some fields are missing')
}

const parseOldProjectData = (startingObject: unknown): ProjectType => {
  const object = parseObject(startingObject)
  if ('id' in object && 'dateAdded' in object) {
    const parsedObject = {
      ...parseNewProjectData(object),
      id: parseString(object.id, 'id'),
      dateAdded: parseDate(object.dateAdded),
    }
    return parsedObject
  }
  throw new Error('Incorrect data: some fields are missing')
}

export default { parseUserData, parseNewProjectData, parseOldProjectData }

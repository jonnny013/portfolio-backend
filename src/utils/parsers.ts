import z from 'npm:zod'

export const ProjectParser = z.object({
  title: z.string().min(3),
  project: z.string().min(5),
  description: z.string().min(5),
  website: z.string().min(5),
  sourceCode: z.string().optional(),
  skills: z.object({
    css: z.boolean().optional(),
    html: z.boolean().optional(),
    node: z.boolean().optional(),
    react: z.boolean().optional(),
    bootstrap: z.boolean().optional(),
    materialUI: z.boolean().optional(),
    mongoDB: z.boolean().optional(),
    express: z.boolean().optional(),
    javascript: z.boolean().optional(),
    typescript: z.boolean().optional(),
    deno: z.boolean().optional(),
    postgres: z.boolean().optional(),
    aws: z.boolean().optional(),
  }),
  recommended: z.boolean(),
})

export const OldProjectParser = ProjectParser.extend({
  id: z.string(),
})

export const LoginParser = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export const ContactFormParser = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(5),
  dateAdded: z.string().optional(),
})

export const NewUserParser = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export const AboutMeParser = z.object({
  picture: z.string().optional(),
  name: z.string(),
  description: z.string(),
  picDesc: z.string(),
  type: z.enum(['Certificate', 'Personal', 'Experience']),
  dateAdded: z.string().optional(),
})


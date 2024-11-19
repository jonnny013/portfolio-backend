import 'npm:dotenv/config'

const PORT = Deno.env.get('PORT')
const MONGODB_URI =
  Deno.env.get('NODE_ENV') === 'test'
    ? Deno.env.get('MONGODB_URI_TESTING')
    : Deno.env.get('MONGODB_URI')

const SECRET: string | undefined = Deno.env.get('SECRET')

export default { PORT, MONGODB_URI, SECRET }

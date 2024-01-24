import { UserType } from "../types";
import User from '../models/user'

const getUser = async () => {
  const user = await User.find({})
  return user
}

const addUser = async ({password, username}: {password: string, username: string}) => {
  const result = await 
}

export default {getUser}
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  literal,
} from 'sequelize'
import { sequelize } from '../db/db'

class Email extends Model<
  InferAttributes<Email>,
  InferCreationAttributes<
    Email,
    {
      omit: 'id' | 'createdAt' | 'updatedAt'
    }
  >
> {
  declare id: number
  name!: string
  message!: string
  subject!: string
  email!: string
  senderInfo!: string
  declare createdAt: Date
  declare updatedAt: Date
}

Email.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderInfo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    tableName: 'emails',
    underscored: true,
    timestamps: true,
  }
)
export default Email

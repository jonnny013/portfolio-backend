import { DataTypes, Model, InferAttributes, InferCreationAttributes, literal } from 'sequelize'
import { sequelize } from '../db/db.js'

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<
    User,
    {
      omit: 'id' | 'createdAt' | 'updatedAt' | 'accountStatus'
    }
  >
> {
  declare id: number
  username!: string
  passwordHash!: string
  declare accountStatus: string
  declare createdAt: Date
  declare updatedAt: Date
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    accountStatus: {
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
    tableName: 'users',
    underscored: true,
    timestamps: true,
  }
)
export default User

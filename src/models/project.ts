import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  literal,
} from 'sequelize'
import { sequelize } from '../db/db'

class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<
    Project,
    {
      omit: 'id' | 'createdAt' | 'updatedAt'
    }
  >
> {
  declare id: number
  title!: string
  project!: string
  description!: string
  website!: string
  sourceCode!: string
  skills!: string[]
  recommended!: boolean
  image?: string
  declare createdAt: Date
  declare updatedAt: Date
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    project: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    website: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sourceCode: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    skills: {
      type: DataTypes.JSONB,
    },
    recommended: {
      type: DataTypes.BOOLEAN,
    },
    image: {
      type: DataTypes.TEXT,
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
    tableName: 'projects',
    underscored: true,
    timestamps: true,
  }
)
export default Project

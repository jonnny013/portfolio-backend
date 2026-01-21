import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  literal,
} from 'sequelize'
import { sequelize } from '../db/db.js'

class AboutMePost extends Model<
  InferAttributes<AboutMePost>,
  InferCreationAttributes<
    AboutMePost,
    {
      omit: 'id' | 'createdAt' | 'updatedAt'
    }
  >
> {
  declare id: number
  picture!: string
  name!: string
  description!: string
  picDesc!: string
  type!: string
  declare createdAt: Date
  declare updatedAt: Date
}

AboutMePost.init(
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
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    picDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    picture: {
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
    tableName: 'about_me_posts',
    underscored: true,
    timestamps: true,
  },
)
export default AboutMePost

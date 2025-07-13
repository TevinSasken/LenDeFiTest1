import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ROSCAAttributes {
  id: string;
  name: string;
  description: string;
  contributionAmount: number;
  cycleDuration: number;
  maxMembers: number;
  currentMembers: number;
  isOnChain: boolean;
  status: 'active' | 'completed' | 'cancelled';
  currentCycle: number;
  nextPayoutDate: Date;
  createdBy: string;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ROSCACreationAttributes extends Optional<ROSCAAttributes, 'id' | 'createdAt' | 'updatedAt' | 'currentMembers' | 'currentCycle'> {}

class ROSCA extends Model<ROSCAAttributes, ROSCACreationAttributes> implements ROSCAAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public contributionAmount!: number;
  public cycleDuration!: number;
  public maxMembers!: number;
  public currentMembers!: number;
  public isOnChain!: boolean;
  public status!: 'active' | 'completed' | 'cancelled';
  public currentCycle!: number;
  public nextPayoutDate!: Date;
  public createdBy!: string;
  public inviteCode!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ROSCA.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contributionAmount: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
      validate: {
        min: 0.001,
      },
    },
    cycleDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 365,
      },
    },
    maxMembers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2,
        max: 50,
      },
    },
    currentMembers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    isOnChain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      defaultValue: 'active',
      allowNull: false,
    },
    currentCycle: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    nextPayoutDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    inviteCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'roscas',
    timestamps: true,
    indexes: [
      {
        fields: ['created_by'],
      },
      {
        fields: ['status'],
      },
      {
        unique: true,
        fields: ['invite_code'],
      },
    ],
  }
);

export default ROSCA;
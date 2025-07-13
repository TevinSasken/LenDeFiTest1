import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  dateOfBirth: Date;
  idNumber: string;
  walletAddress?: string;
  role: 'user' | 'admin';
  kycStatus: 'pending' | 'verified' | 'rejected';
  profilePicture?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'walletAddress' | 'profilePicture' | 'lastLogin'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public name!: string;
  public phone!: string;
  public dateOfBirth!: Date;
  public idNumber!: string;
  public walletAddress?: string;
  public role!: 'user' | 'admin';
  public kycStatus!: 'pending' | 'verified' | 'rejected';
  public profilePicture?: string;
  public isActive!: boolean;
  public lastLogin?: Date;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Instance methods
  public toJSON(): Partial<UserAttributes> {
    const values = { ...this.get() };
    delete values.passwordHash;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 15],
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    idNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    walletAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false,
    },
    kycStatus: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending',
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        unique: true,
        fields: ['wallet_address'],
      },
      {
        fields: ['kyc_status'],
      },
      {
        fields: ['role'],
      },
    ],
  }
);

export default User;
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TransactionAttributes {
  id: string;
  userId: string;
  type: 'loan' | 'rosca' | 'deposit' | 'withdrawal';
  subType: 'request' | 'funded' | 'repayment' | 'contribution' | 'payout' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  referenceId?: string;
  txHash?: string;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'referenceId' | 'txHash' | 'metadata'> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: string;
  public userId!: string;
  public type!: 'loan' | 'rosca' | 'deposit' | 'withdrawal';
  public subType!: 'request' | 'funded' | 'repayment' | 'contribution' | 'payout' | 'deposit' | 'withdrawal';
  public amount!: number;
  public description!: string;
  public status!: 'pending' | 'completed' | 'failed' | 'cancelled';
  public referenceId?: string;
  public txHash?: string;
  public metadata?: object;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('loan', 'rosca', 'deposit', 'withdrawal'),
      allowNull: false,
    },
    subType: {
      type: DataTypes.ENUM('request', 'funded', 'repayment', 'contribution', 'payout', 'deposit', 'withdrawal'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    referenceId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    txHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
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
    tableName: 'transactions',
    timestamps: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default Transaction;
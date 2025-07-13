import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface LoanAttributes {
  id: string;
  userId: string;
  lenderId?: string;
  amount: number;
  interestRate: number;
  duration: number;
  collateral: string;
  description: string;
  status: 'pending' | 'funded' | 'active' | 'repaid' | 'defaulted';
  monthlyPayment: number;
  totalRepaid: number;
  remainingBalance: number;
  nextPaymentDate?: Date;
  fundedAt?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface LoanCreationAttributes extends Optional<LoanAttributes, 'id' | 'createdAt' | 'updatedAt' | 'lenderId' | 'fundedAt' | 'dueDate' | 'nextPaymentDate'> {}

class Loan extends Model<LoanAttributes, LoanCreationAttributes> implements LoanAttributes {
  public id!: string;
  public userId!: string;
  public lenderId?: string;
  public amount!: number;
  public interestRate!: number;
  public duration!: number;
  public collateral!: string;
  public description!: string;
  public status!: 'pending' | 'funded' | 'active' | 'repaid' | 'defaulted';
  public monthlyPayment!: number;
  public totalRepaid!: number;
  public remainingBalance!: number;
  public nextPaymentDate?: Date;
  public fundedAt?: Date;
  public dueDate?: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Loan.init(
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
    lenderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
      validate: {
        min: 0.001,
      },
    },
    interestRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 60,
      },
    },
    collateral: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'funded', 'active', 'repaid', 'defaulted'),
      defaultValue: 'pending',
      allowNull: false,
    },
    monthlyPayment: {
      type: DataTypes.DECIMAL(18, 8),
      defaultValue: 0,
      allowNull: false,
    },
    totalRepaid: {
      type: DataTypes.DECIMAL(18, 8),
      defaultValue: 0,
      allowNull: false,
    },
    remainingBalance: {
      type: DataTypes.DECIMAL(18, 8),
      defaultValue: 0,
      allowNull: false,
    },
    nextPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dueDate: {
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
    tableName: 'loans',
    timestamps: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['lender_id'],
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

export default Loan;
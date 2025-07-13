import { Sequelize } from 'sequelize';
import { sequelize } from '../config/database';

// Import all models
import User from './User';
import Loan from './Loan';
import ROSCA from './ROSCA';
import Transaction from './Transaction';

// Define associations
const setupAssociations = () => {
  // User associations
  User.hasMany(Loan, { foreignKey: 'userId', as: 'borrowedLoans' });
  User.hasMany(Loan, { foreignKey: 'lenderId', as: 'lentLoans' });
  User.hasMany(ROSCA, { foreignKey: 'createdBy', as: 'createdROSCAs' });
  User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });

  // Loan associations
  Loan.belongsTo(User, { foreignKey: 'userId', as: 'borrower' });
  Loan.belongsTo(User, { foreignKey: 'lenderId', as: 'lender' });

  // ROSCA associations
  ROSCA.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

  // Transaction associations
  Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};

// Setup associations
setupAssociations();

const db = {
  sequelize,
  Sequelize,
  User,
  Loan,
  ROSCA,
  Transaction,
};

export default db;
export { User, Loan, ROSCA, Transaction };
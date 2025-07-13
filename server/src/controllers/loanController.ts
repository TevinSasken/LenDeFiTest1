import { Response } from 'express';
import { Loan, User, Transaction } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

export const createLoanRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, interestRate, duration, collateral, description } = req.body;
    const userId = req.user.id;

    // Calculate monthly payment (simple interest)
    const totalAmount = amount * (1 + (interestRate / 100));
    const monthlyPayment = totalAmount / duration;

    const loan = await Loan.create({
      userId,
      amount,
      interestRate,
      duration,
      collateral,
      description,
      monthlyPayment,
      totalRepaid: 0,
      remainingBalance: totalAmount,
      status: 'pending'
    });

    // Create transaction record
    await Transaction.create({
      userId,
      type: 'loan',
      subType: 'request',
      amount,
      description: `Loan request: ${description}`,
      status: 'completed',
      referenceId: loan.id
    });

    res.status(201).json({
      success: true,
      message: 'Loan request created successfully',
      data: { loan }
    });
  } catch (error) {
    console.error('Create loan request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getLoans = async (req: AuthRequest, res: Response) => {
  try {
    const { type = 'all', status, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause: any = {};

    if (type === 'borrowed') {
      whereClause.userId = userId;
    } else if (type === 'lent') {
      whereClause.lenderId = userId;
    } else if (type === 'marketplace') {
      whereClause = {
        status: 'pending',
        userId: { [Op.ne]: userId }
      };
    } else {
      // All loans for the user
      whereClause = {
        [Op.or]: [
          { userId },
          { lenderId: userId }
        ]
      };
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows: loans } = await Loan.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'borrower', attributes: ['id', 'name', 'email', 'kycStatus'] },
        { model: User, as: 'lender', attributes: ['id', 'name', 'email', 'kycStatus'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        loans,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getLoanById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const loan = await Loan.findOne({
      where: {
        id,
        [Op.or]: [
          { userId },
          { lenderId: userId }
        ]
      },
      include: [
        { model: User, as: 'borrower', attributes: ['id', 'name', 'email', 'kycStatus'] },
        { model: User, as: 'lender', attributes: ['id', 'name', 'email', 'kycStatus'] }
      ]
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    res.json({
      success: true,
      data: { loan }
    });
  } catch (error) {
    console.error('Get loan by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const fundLoan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lenderId = req.user.id;

    const loan = await Loan.findOne({
      where: { id, status: 'pending' }
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found or already funded'
      });
    }

    if (loan.userId === lenderId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot fund your own loan'
      });
    }

    // Calculate due date
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + loan.duration);

    // Calculate next payment date (1 month from now)
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    await loan.update({
      lenderId,
      status: 'active',
      fundedAt: new Date(),
      dueDate,
      nextPaymentDate
    });

    // Create transaction records
    await Transaction.create({
      userId: lenderId,
      type: 'loan',
      subType: 'funded',
      amount: loan.amount,
      description: `Funded loan for ${loan.description}`,
      status: 'completed',
      referenceId: loan.id
    });

    res.json({
      success: true,
      message: 'Loan funded successfully',
      data: { loan }
    });
  } catch (error) {
    console.error('Fund loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const makePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;

    const loan = await Loan.findOne({
      where: { id, userId, status: 'active' }
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found or not active'
      });
    }

    if (amount <= 0 || amount > loan.remainingBalance) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }

    const newTotalRepaid = Number(loan.totalRepaid) + Number(amount);
    const newRemainingBalance = Number(loan.remainingBalance) - Number(amount);

    // Update loan
    const updateData: any = {
      totalRepaid: newTotalRepaid,
      remainingBalance: newRemainingBalance
    };

    // If fully paid, mark as repaid
    if (newRemainingBalance <= 0.001) {
      updateData.status = 'repaid';
      updateData.nextPaymentDate = null;
    } else {
      // Calculate next payment date
      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      updateData.nextPaymentDate = nextPaymentDate;
    }

    await loan.update(updateData);

    // Create transaction record
    await Transaction.create({
      userId,
      type: 'loan',
      subType: 'repayment',
      amount,
      description: `Loan repayment for ${loan.description}`,
      status: 'completed',
      referenceId: loan.id
    });

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: { loan }
    });
  } catch (error) {
    console.error('Make payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
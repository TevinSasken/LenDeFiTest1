import { Response } from 'express';
import { Transaction, User } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { type, status, page = 1, limit = 10, startDate, endDate } = req.query;
    const userId = req.user.id;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause: any = { userId };

    if (type && type !== 'all') {
      whereClause.type = type;
    }

    if (status) {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    }

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      where: { id, userId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: { transaction }
    });
  } catch (error) {
    console.error('Get transaction by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { type, subType, amount, description, referenceId, metadata } = req.body;
    const userId = req.user.id;

    const transaction = await Transaction.create({
      userId,
      type,
      subType,
      amount,
      description,
      referenceId,
      metadata,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: { transaction }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateTransactionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, txHash } = req.body;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      where: { id, userId }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    await transaction.update({ status, txHash });

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: { transaction }
    });
  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getTransactionSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    // Get summary statistics
    const loanTransactions = await Transaction.findAll({
      where: { userId, type: 'loan' },
      attributes: ['subType', 'amount', 'status']
    });

    const roscaTransactions = await Transaction.findAll({
      where: { userId, type: 'rosca' },
      attributes: ['subType', 'amount', 'status']
    });

    // Calculate totals
    const totalLent = loanTransactions
      .filter(t => t.subType === 'funded' && t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalBorrowed = loanTransactions
      .filter(t => t.subType === 'request' && t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalRepaid = loanTransactions
      .filter(t => t.subType === 'repayment' && t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalROSCAContributions = roscaTransactions
      .filter(t => t.subType === 'contribution' && t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalROSCAPayouts = roscaTransactions
      .filter(t => t.subType === 'payout' && t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    res.json({
      success: true,
      data: {
        summary: {
          totalLent,
          totalBorrowed,
          totalRepaid,
          totalROSCAContributions,
          totalROSCAPayouts,
          netBalance: totalLent - totalBorrowed + totalRepaid + totalROSCAPayouts - totalROSCAContributions
        }
      }
    });
  } catch (error) {
    console.error('Get transaction summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
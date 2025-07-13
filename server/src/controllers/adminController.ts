import { Request, Response } from 'express';
import { User, Loan, ROSCA, Transaction } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // Get total counts
    const totalUsers = await User.count();
    const totalLoans = await Loan.count();
    const totalROSCAs = await ROSCA.count();
    const totalTransactions = await Transaction.count();

    // Get active counts
    const activeLoans = await Loan.count({ where: { status: 'active' } });
    const activeROSCAs = await ROSCA.count({ where: { status: 'active' } });
    const verifiedUsers = await User.count({ where: { kycStatus: 'verified' } });

    // Get total amounts
    const totalLoanAmount = await Loan.sum('amount', { where: { status: ['active', 'repaid'] } }) || 0;
    const totalROSCAAmount = await ROSCA.sum('contributionAmount') || 0;

    // Get recent activity
    const recentUsers = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'email', 'kycStatus', 'createdAt']
    });

    const recentLoans = await Loan.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [
        { model: User, as: 'borrower', attributes: ['name', 'email'] }
      ]
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalLoans,
          totalROSCAs,
          totalTransactions,
          activeLoans,
          activeROSCAs,
          verifiedUsers,
          totalLoanAmount,
          totalROSCAAmount
        },
        recentActivity: {
          users: recentUsers,
          loans: recentLoans
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, kycStatus, role } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause: any = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    if (kycStatus) {
      whereClause.kycStatus = kycStatus;
    }

    if (role) {
      whereClause.role = role;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
      attributes: { exclude: ['passwordHash'] }
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's loans
    const loans = await Loan.findAll({
      where: {
        [Op.or]: [
          { userId: id },
          { lenderId: id }
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Get user's transactions
    const transactions = await Transaction.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        user,
        loans,
        transactions
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateKYCStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { kycStatus, reason } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ kycStatus });

    res.json({
      success: true,
      message: `KYC status updated to ${kycStatus}`,
      data: { user: user.toJSON() }
    });
  } catch (error) {
    console.error('Update KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateLoanStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const loan = await Loan.findByPk(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    await loan.update({ status });

    res.json({
      success: true,
      message: `Loan status updated to ${status}`,
      data: { loan }
    });
  } catch (error) {
    console.error('Update loan status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deactivateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ isActive: false });

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: { user: user.toJSON() }
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const exportData = async (req: AuthRequest, res: Response) => {
  try {
    const { type, format = 'csv', startDate, endDate } = req.query;

    let data: any[] = [];
    let filename = '';

    const dateFilter = startDate && endDate ? {
      createdAt: {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      }
    } : {};

    switch (type) {
      case 'users':
        data = await User.findAll({
          where: dateFilter,
          attributes: { exclude: ['passwordHash'] },
          raw: true
        });
        filename = `users_export_${new Date().toISOString().split('T')[0]}`;
        break;

      case 'loans':
        data = await Loan.findAll({
          where: dateFilter,
          include: [
            { model: User, as: 'borrower', attributes: ['name', 'email'] },
            { model: User, as: 'lender', attributes: ['name', 'email'] }
          ],
          raw: true
        });
        filename = `loans_export_${new Date().toISOString().split('T')[0]}`;
        break;

      case 'transactions':
        data = await Transaction.findAll({
          where: dateFilter,
          include: [
            { model: User, as: 'user', attributes: ['name', 'email'] }
          ],
          raw: true
        });
        filename = `transactions_export_${new Date().toISOString().split('T')[0]}`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvData);
    } else {
      // Return JSON for PDF generation on frontend
      res.json({
        success: true,
        data: {
          records: data,
          filename,
          type,
          exportDate: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
};
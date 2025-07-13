import { Response } from 'express';
import { ROSCA, User, Transaction } from '../models';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export const createROSCA = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, contributionAmount, cycleDuration, maxMembers, isOnChain } = req.body;
    const createdBy = req.user.id;

    // Generate unique invite code
    const inviteCode = uuidv4().substring(0, 8).toUpperCase();

    // Calculate next payout date
    const nextPayoutDate = new Date();
    nextPayoutDate.setDate(nextPayoutDate.getDate() + cycleDuration);

    const rosca = await ROSCA.create({
      name,
      description,
      contributionAmount,
      cycleDuration,
      maxMembers,
      currentMembers: 1, // Creator is automatically a member
      isOnChain,
      createdBy,
      inviteCode,
      nextPayoutDate,
      status: 'active',
      currentCycle: 1
    });

    res.status(201).json({
      success: true,
      message: 'ROSCA created successfully',
      data: { 
        rosca,
        inviteLink: `${process.env.FRONTEND_URL}/rosca/join/${inviteCode}`
      }
    });
  } catch (error) {
    console.error('Create ROSCA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getROSCAs = async (req: AuthRequest, res: Response) => {
  try {
    const { type = 'available', page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause: any = {};

    if (type === 'my-roscas') {
      whereClause.createdBy = userId;
    } else {
      // Available ROSCAs (not full and active)
      whereClause = {
        status: 'active'
      };
    }

    const { count, rows: roscas } = await ROSCA.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        roscas,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get ROSCAs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getROSCAById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const rosca = await ROSCA.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!rosca) {
      return res.status(404).json({
        success: false,
        message: 'ROSCA not found'
      });
    }

    res.json({
      success: true,
      data: { rosca }
    });
  } catch (error) {
    console.error('Get ROSCA by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const joinROSCA = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rosca = await ROSCA.findByPk(id);

    if (!rosca) {
      return res.status(404).json({
        success: false,
        message: 'ROSCA not found'
      });
    }

    if (rosca.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'ROSCA is not active'
      });
    }

    if (rosca.currentMembers >= rosca.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'ROSCA is full'
      });
    }

    // Update member count
    await rosca.update({
      currentMembers: rosca.currentMembers + 1
    });

    res.json({
      success: true,
      message: 'Successfully joined ROSCA',
      data: { rosca }
    });
  } catch (error) {
    console.error('Join ROSCA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const contributeToROSCA = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;

    const rosca = await ROSCA.findByPk(id);

    if (!rosca) {
      return res.status(404).json({
        success: false,
        message: 'ROSCA not found'
      });
    }

    if (rosca.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'ROSCA is not active'
      });
    }

    if (Number(amount) !== Number(rosca.contributionAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Contribution amount must match ROSCA requirement'
      });
    }

    // Create transaction record
    await Transaction.create({
      userId,
      type: 'rosca',
      subType: 'contribution',
      amount,
      description: `Contribution to ${rosca.name} - Cycle ${rosca.currentCycle}`,
      status: 'completed',
      referenceId: rosca.id
    });

    res.json({
      success: true,
      message: 'Contribution successful',
      data: { rosca }
    });
  } catch (error) {
    console.error('Contribute to ROSCA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const joinROSCAByInvite = async (req: AuthRequest, res: Response) => {
  try {
    const { inviteCode } = req.params;
    const userId = req.user.id;

    const rosca = await ROSCA.findOne({
      where: { inviteCode }
    });

    if (!rosca) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite code'
      });
    }

    if (rosca.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'ROSCA is not active'
      });
    }

    if (rosca.currentMembers >= rosca.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'ROSCA is full'
      });
    }

    // Update member count
    await rosca.update({
      currentMembers: rosca.currentMembers + 1
    });

    res.json({
      success: true,
      message: 'Successfully joined ROSCA',
      data: { rosca }
    });
  } catch (error) {
    console.error('Join ROSCA by invite error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
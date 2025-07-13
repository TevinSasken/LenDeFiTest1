import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    }),
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(10).max(15).required(),
  dateOfBirth: Joi.date().max('now').required(),
  idNumber: Joi.string().required(),
  role: Joi.string().valid('user', 'admin').default('user'),
  adminSecret: Joi.when('role', {
    is: 'admin',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const loanRequestSchema = Joi.object({
  amount: Joi.number().min(0.001).required(),
  interestRate: Joi.number().min(0).max(100).required(),
  duration: Joi.number().integer().min(1).max(60).required(),
  collateral: Joi.string().required(),
  description: Joi.string().required()
});

export const roscaCreateSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().required(),
  contributionAmount: Joi.number().min(0.001).required(),
  cycleDuration: Joi.number().integer().min(1).max(365).required(),
  maxMembers: Joi.number().integer().min(2).max(50).required(),
  isOnChain: Joi.boolean().default(false)
});
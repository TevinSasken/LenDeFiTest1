import request from 'supertest';
import app from '../app';

describe('Loan API', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;

  beforeEach(async () => {
    // Create and login regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user@example.com',
        password: 'TestPassword123!',
        name: 'Test User',
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        idNumber: 'ID123456789'
      });

    userToken = userResponse.body.data.token;
    userId = userResponse.body.data.user.id;

    // Verify user's KYC for testing
    await request(app)
      .put(`/api/admin/users/${userId}/kyc`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ kycStatus: 'verified' });
  });

  describe('POST /api/loans/request', () => {
    it('should create loan request with valid data', async () => {
      const loanData = {
        amount: 0.5,
        interestRate: 8.5,
        duration: 12,
        collateral: 'Real Estate Deed',
        description: 'Business expansion loan'
      };

      const response = await request(app)
        .post('/api/loans/request')
        .set('Authorization', `Bearer ${userToken}`)
        .send(loanData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.loan.amount).toBe(loanData.amount);
    });

    it('should not create loan request without authentication', async () => {
      const loanData = {
        amount: 0.5,
        interestRate: 8.5,
        duration: 12,
        collateral: 'Real Estate Deed',
        description: 'Business expansion loan'
      };

      const response = await request(app)
        .post('/api/loans/request')
        .send(loanData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/loans', () => {
    it('should get user loans', async () => {
      // First create a loan
      await request(app)
        .post('/api/loans/request')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          amount: 0.5,
          interestRate: 8.5,
          duration: 12,
          collateral: 'Real Estate Deed',
          description: 'Business expansion loan'
        });

      const response = await request(app)
        .get('/api/loans')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.loans).toBeDefined();
    });
  });
});
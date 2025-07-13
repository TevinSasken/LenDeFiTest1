# LenDeFi Backend API

A comprehensive backend service for the LenDeFi P2P lending and ROSCA platform built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **User Authentication & Authorization**: JWT-based auth with role-based access control
- **KYC Management**: User verification and document handling
- **Loan Management**: Create, fund, and manage P2P loans
- **ROSCA Groups**: Rotating savings and credit associations
- **Transaction Tracking**: Comprehensive transaction history
- **Admin Panel**: Administrative controls and reporting
- **Data Export**: CSV and PDF export functionality
- **Security**: Rate limiting, input validation, and data encryption

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens
- **Validation**: Joi schema validation
- **Testing**: Jest with Supertest
- **Security**: Helmet, CORS, bcrypt, rate limiting

## Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL v15 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DB_NAME=lendfi_db
   DB_USER=lendfi_user
   DB_PASSWORD=your_secure_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_super_secret_jwt_key
   ADMIN_SECRET=admin_secret_code_2024
   ```

4. **Set up PostgreSQL database**
   ```sql
   -- Connect to PostgreSQL as superuser
   sudo -u postgres psql
   
   -- Create database and user
   CREATE USER lendfi_user WITH PASSWORD 'your_secure_password';
   CREATE DATABASE lendfi_db;
   GRANT ALL PRIVILEGES ON DATABASE lendfi_db TO lendfi_user;
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Loans
- `POST /api/loans/request` - Create loan request
- `GET /api/loans` - Get loans (with filters)
- `GET /api/loans/:id` - Get loan details
- `POST /api/loans/:id/fund` - Fund a loan
- `POST /api/loans/:id/payment` - Make loan payment

### ROSCA
- `POST /api/roscas` - Create ROSCA group
- `GET /api/roscas` - Get ROSCA groups
- `GET /api/roscas/:id` - Get ROSCA details
- `POST /api/roscas/:id/join` - Join ROSCA group
- `POST /api/roscas/:id/contribute` - Make contribution
- `POST /api/roscas/join/:inviteCode` - Join via invite code

### Transactions
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/summary` - Get transaction summary
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id/status` - Update transaction status

### Admin (Admin role required)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/kyc` - Update KYC status
- `PUT /api/admin/users/:id/deactivate` - Deactivate user
- `PUT /api/admin/loans/:id/status` - Update loan status
- `GET /api/admin/export` - Export data (CSV/PDF)

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String)
- `name` (String)
- `phone` (String)
- `date_of_birth` (Date)
- `id_number` (String, Unique)
- `wallet_address` (String, Unique, Optional)
- `role` (Enum: user, admin)
- `kyc_status` (Enum: pending, verified, rejected)
- `profile_picture` (String, Optional)
- `is_active` (Boolean)
- `last_login` (Date, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Loans Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `lender_id` (UUID, Foreign Key, Optional)
- `amount` (Decimal)
- `interest_rate` (Decimal)
- `duration` (Integer, months)
- `collateral` (Text)
- `description` (Text)
- `status` (Enum: pending, funded, active, repaid, defaulted)
- `monthly_payment` (Decimal)
- `total_repaid` (Decimal)
- `remaining_balance` (Decimal)
- `next_payment_date` (Date, Optional)
- `funded_at` (Date, Optional)
- `due_date` (Date, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### ROSCAs Table
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `contribution_amount` (Decimal)
- `cycle_duration` (Integer, days)
- `max_members` (Integer)
- `current_members` (Integer)
- `is_on_chain` (Boolean)
- `status` (Enum: active, completed, cancelled)
- `current_cycle` (Integer)
- `next_payout_date` (Date)
- `created_by` (UUID, Foreign Key)
- `invite_code` (String, Unique)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Transactions Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `type` (Enum: loan, rosca, deposit, withdrawal)
- `sub_type` (Enum: request, funded, repayment, contribution, payout, deposit, withdrawal)
- `amount` (Decimal)
- `description` (Text)
- `status` (Enum: pending, completed, failed, cancelled)
- `reference_id` (UUID, Optional)
- `tx_hash` (String, Optional)
- `metadata` (JSONB, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Joi schema validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Security headers
- **SQL Injection Prevention**: Sequelize ORM protection

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_NAME` | PostgreSQL database name | `lendfi_db` |
| `DB_USER` | Database username | `lendfi_user` |
| `DB_PASSWORD` | Database password | - |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `ADMIN_SECRET` | Admin registration secret | - |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations

### Code Structure

```
src/
├── config/          # Database and app configuration
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── scripts/         # Utility scripts
├── tests/           # Test files
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export DB_HOST=your_production_db_host
   # ... other production variables
   ```

3. **Run migrations**
   ```bash
   npm run migrate
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
# StackIt – A Minimal Q&A Forum Platform

A full-stack Q&A forum platform built with React, Node.js, TypeScript, and PostgreSQL. This project was created for the Odoo-Hack-Paradox hackathon.

## 🚀 Features

- **User Authentication**: Register and login with JWT tokens
- **Question Management**: Ask, edit, and delete questions
- **Answer System**: Provide answers with acceptance functionality
- **Voting System**: Upvote and downvote questions and answers
- **Tagging**: Organize questions with tags
- **Search**: Find questions by title, content, or tags
- **User Profiles**: View user statistics and activity
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- React Query for data fetching
- Axios for API calls
- Lucide React for icons
- CSS3 for styling

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- JWT authentication
- BCrypt for password hashing
- Express rate limiting

### DevOps
- Docker & Docker Compose
- PostgreSQL Docker container

## 📦 Installation & Setup

### Prerequisites
- Node.js (18+)
- PostgreSQL (or Docker)
- npm or yarn

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Odoo-Hack-Paradox
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Initialize the database**
   ```bash
   # Open a new terminal
   docker-compose exec backend npm run db:setup
   docker-compose exec backend npm run db:seed
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Odoo-Hack-Paradox
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up PostgreSQL**
   - Install PostgreSQL locally
   - Create a database named `stackit_db`
   - Update the `DATABASE_URL` in `backend/.env`

4. **Set up the database**
   ```bash
   cd backend
   npm run db:setup
   npm run db:seed
   ```

5. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/stackit_db"
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create a new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Answers
- `POST /api/answers` - Create a new answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `PATCH /api/answers/:id/accept` - Accept answer

### Voting
- `POST /api/votes/question/:id` - Vote on question
- `POST /api/votes/answer/:id` - Vote on answer

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/questions` - Get user questions
- `GET /api/users/:id/answers` - Get user answers

## 🎯 Usage

### Test Accounts
After seeding the database, you can use these test accounts:

- **Email**: john@example.com, **Password**: password123
- **Email**: jane@example.com, **Password**: password123
- **Email**: bob@example.com, **Password**: password123

### Basic Workflow
1. Register a new account or login with test credentials
2. Browse existing questions on the home page
3. Use the search bar to find specific questions
4. Click on a question to view details and answers
5. Vote on questions and answers
6. Ask new questions using the "Ask Question" button
7. Answer questions by providing detailed responses
8. Accept answers if you're the question author

## 🏗️ Database Schema

### Users
- ID, email, username, password, name, reputation, timestamps

### Questions
- ID, title, content, tags, views, author, timestamps

### Answers
- ID, content, isAccepted, author, question, timestamps

### Votes
- ID, value (+1/-1), user, question/answer, timestamps

## 🧪 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

### Frontend Development
```bash
cd frontend
npm run start        # Start development server
npm run build        # Build for production
npm run test         # Run tests
```

## 🚢 Deployment

### Production Build
```bash
# Build both frontend and backend
npm run build

# Start production server
npm run start
```

### Docker Production
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Sneha Chibrani** - 24btm046@nirmauni.ac.in
- **Nirbhay Shingala** - 24bce268@nirmauni.ac.in
- **Jenil Mehta** - 24bce267@nirmauni.ac.in
- **Het Shah** - 24bce261@nirmauni.ac.in

## 🔗 Links

- [Backend API Documentation](http://localhost:3001/api/health)
- [Frontend Application](http://localhost:3000)
- [Database Studio](http://localhost:5432) (when using Docker)

## 🐛 Known Issues

- None at the moment

## 📱 Screenshots

[Add screenshots of your application here]

---

Built with ❤️ for the Odoo-Hack-Paradox hackathon

# ShopSwift - E-Commerce Platform

A full-stack e-commerce application built with Spring Boot (Backend) and Next.js (Frontend).

## Features

- 🛍️ **Product Management**: Browse, search, and view product details
- 🛒 **Shopping Cart**: Add products to cart and manage quantities
- 👤 **User Authentication**: JWT-based authentication with role-based access control
- 🔐 **Admin Panel**: Admin users can add, update, and delete products
- 📦 **Order Management**: Place orders and view order history
- 💳 **Checkout System**: Secure checkout process with user details auto-fetch

## Tech Stack

### Backend
- **Spring Boot** - Java framework
- **PostgreSQL** - Database
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **JPA/Hibernate** - ORM

### Frontend
- **Next.js 13** - React framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL database
- Maven (for backend)
- npm or yarn (for frontend)

## Setup Instructions

### Backend Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd SpringEcom
```

2. Configure database:
   - Create a PostgreSQL database named `Demo`
   - Copy `src/main/resources/application.properties.example` to `application.properties`
   - Update database credentials in `application.properties`

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd root
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Deployment

### Frontend (Vercel)
See `DEPLOYMENT.md` and `VERCEL_SETUP.md` for detailed frontend deployment instructions.

### Backend (Render/Railway/Heroku)
See `BACKEND_DEPLOYMENT.md` for comprehensive backend deployment guide, or `QUICK_START_BACKEND.md` for a quick 5-step setup.

**Quick Summary:**
1. Deploy PostgreSQL database (Render, Railway, or cloud provider)
2. Deploy Spring Boot backend (Render recommended)
3. Configure environment variables (database URL, CORS origins)
4. Update frontend `NEXT_PUBLIC_API_URL` in Vercel
5. Test the connection

## Default Credentials

### Admin Login
- Username: `admin`
- Password: `admin123`

### Regular User
- Register a new account through the registration page

## API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/admin/login` - Admin login

### Protected Endpoints (Requires Authentication)
- `POST /api/place` - Place an order
- `GET /api/orders` - Get user orders
- `GET /api/user/current` - Get current user details

### Admin Only Endpoints
- `POST /api/product` - Add new product
- `PUT /api/product/{id}` - Update product
- `DELETE /api/product/{id}` - Delete product

## Project Structure

```
SpringEcom/
├── src/main/java/com/devanshu/springecom/
│   ├── Controller/     # REST Controllers
│   ├── Service/       # Business Logic
│   ├── Model/         # Entity Models
│   ├── Repo/          # Repository Interfaces
│   ├── config/        # Configuration Classes
│   └── filter/        # JWT Filter
├── root/          # Next.js Frontend
│   ├── src/
│   │   ├── app/       # Next.js App Router
│   │   ├── components/ # React Components
│   │   ├── context/   # Context Providers
│   │   └── redux/     # Redux Store
└── Frontend/          # Old React Frontend (legacy)
```

## Environment Variables

Create a `.env` file in the `root` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

Devanshu


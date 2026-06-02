# Inventory & Order Management System

A production-ready, fully containerized inventory and order management system built with modern web technologies. This application provides comprehensive business management capabilities with a clean, responsive interface.

## 🚀 Live Demo

- **Frontend**: [Live Application](https://your-frontend-url.vercel.app)
- **Backend API**: [API Endpoint](https://your-backend-url.onrender.com)
- **API Documentation**: [Swagger UI](https://your-backend-url.onrender.com/docs)

## 🛠 Tech Stack

- **Backend**: Python 3.11 + FastAPI
- **Frontend**: React 18 + JavaScript
- **Database**: PostgreSQL 15
- **Containerization**: Docker + Docker Compose
- **Deployment**: Render (Backend) + Vercel (Frontend)

## ✨ Features

### Core Functionality
- **Product Management**: Complete CRUD operations with SKU validation
- **Customer Management**: Customer registration and profile management
- **Order Processing**: Advanced order creation with real-time inventory tracking
- **Dashboard Analytics**: Business insights with low-stock alerts

### Business Logic
- Automatic inventory reduction on order creation
- Unique SKU and email validation
- Real-time stock level monitoring
- Order total calculation with proper error handling

### Technical Features
- RESTful API design with OpenAPI documentation
- Responsive mobile-first design
- Containerized microservices architecture
- Production-ready security configurations

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │────│   FastAPI       │────│   PostgreSQL    │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/inventory-management-system.git
cd inventory-management-system
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configurations
```

3. **Launch Application**
```bash
docker-compose up --build
```

4. **Access Services**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Database: localhost:5432

## 📁 Project Structure

```
inventory-management-system/
├── backend/                    # FastAPI application
│   ├── main.py                # Application entry point
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Pydantic schemas
│   ├── crud.py                # Database operations
│   ├── database.py            # Database configuration
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile            # Backend container config
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── api.js           # API client
│   │   └── App.js           # Main app component
│   ├── package.json         # Node.js dependencies
│   └── Dockerfile          # Frontend container config
├── deploy/                   # Deployment configurations
├── docker-compose.yml       # Development orchestration
├── docker-compose.prod.yml  # Production orchestration
└── README.md               # Project documentation
```

## 🔧 API Endpoints

### Products
- `POST /products` - Create product
- `GET /products` - List all products
- `GET /products/{id}` - Get product by ID
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Customers
- `POST /customers` - Create customer
- `GET /customers` - List all customers
- `GET /customers/{id}` - Get customer by ID
- `DELETE /customers/{id}` - Delete customer

### Orders
- `POST /orders` - Create order (with inventory validation)
- `GET /orders` - List all orders
- `GET /orders/{id}` - Get order details
- `DELETE /orders/{id}` - Cancel order (restores inventory)

### Dashboard
- `GET /dashboard` - Get business analytics and low-stock alerts

## 🐳 Docker Configuration

### Development
```bash
docker-compose up --build
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🚢 Deployment

### Backend (Render.com)
1. Connect GitHub repository
2. Configure build: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add PostgreSQL database
5. Deploy automatically

### Frontend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend: `cd frontend`
3. Deploy: `vercel --prod`
4. Set environment: `REACT_APP_API_URL`

## 🧪 Testing

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention with SQLAlchemy ORM
- CORS configuration for secure cross-origin requests
- Environment variable management
- Non-root Docker containers

## 📊 Business Rules

- Product SKU must be unique across the system
- Customer email addresses must be unique
- Product quantities cannot be negative
- Orders cannot exceed available inventory
- Order creation automatically reduces stock levels
- Order cancellation restores inventory

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Performance

- Docker multi-stage builds for optimized images
- PostgreSQL with proper indexing
- React code splitting and lazy loading
- Nginx reverse proxy for production
- Connection pooling for database efficiency

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
- Review API documentation at `/docs` endpoint

---

**Built with ❤️ for modern inventory management**
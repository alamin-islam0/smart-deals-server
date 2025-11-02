# Smart Deals Server

This is the backend server for the Smart Deals application, built with Node.js, Express.js, and MongoDB.

## Features

- **RESTful API Endpoints** for product management:

  - GET `/products` - Retrieve all products
  - GET `/products/:id` - Retrieve a specific product
  - POST `/products` - Create a new product
  - PATCH `/products/:id` - Update an existing product
  - DELETE `/products/:id` - Delete a product

- **MongoDB Integration**

  - Secure connection to MongoDB Atlas
  - Efficient data management using MongoDB native driver
  - Robust error handling for database operations

- **Modern Architecture**
  - Built with Express.js framework
  - CORS enabled for cross-origin requests
  - JSON middleware for request parsing
  - Environment variable support for configuration

## Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Dependencies**:
  - `express`: Web application framework
  - `mongodb`: MongoDB driver for Node.js
  - `cors`: Cross-origin resource sharing middleware

## Getting Started

1. **Clone the repository**

```bash
git clone [repository-url]
cd smart-deals-server
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the server**

```bash
npm start
```

The server will start on port 3000 by default, or you can specify a different port using the PORT environment variable.

## API Documentation

### Get All Products

```http
GET /products
```

### Get Single Product

```http
GET /products/:id
```

### Create Product

```http
POST /products
Content-Type: application/json

{
    "name": "Product Name",
    "price": "Product Price"
}
```

### Update Product

```http
PATCH /products/:id
Content-Type: application/json

{
    "name": "Updated Name",
    "price": "Updated Price"
}
```

### Delete Product

```http
DELETE /products/:id
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- MongoDB connection string is currently hardcoded (consider moving to environment variables for production)

## License

ISC

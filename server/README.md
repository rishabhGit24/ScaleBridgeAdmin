# ScaleBridge Backend API

Backend server for ScaleBridge landing page with MongoDB Atlas integration.

## Setup Instructions

1. **Install Dependencies**

   ```bash
   cd server
   npm install
   ```

2. **Environment Variables**
   The `.env` file is already configured with your MongoDB Atlas credentials:
   - Database: `scalebridge`
   - Collection: `contacts`

3. **Start the Server**

   Development mode (with auto-restart):

   ```bash
   npm run dev
   ```

   Production mode:

   ```bash
   npm start
   ```

4. **Start the Frontend**
   In a separate terminal, from the root directory:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST /api/contacts

Save contact form data to MongoDB

**Request Body:**

```json
{
  "name": "John Doe",
  "company": "Example Corp",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'd like to know more about your services"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Contact information saved successfully",
  "id": "mongodb_document_id"
}
```

### GET /api/contacts

Retrieve all contacts (for admin use)

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

## Database Structure

**Database:** scalebridge
**Collection:** contacts

**Document Schema:**

```javascript
{
  name: String (required),
  company: String,
  email: String (required),
  phone: String (required),
  message: String,
  createdAt: Date,
  status: String (default: 'new')
}
```

## Testing

Test the API with curl:

```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "company": "Test Company",
    "email": "test@example.com",
    "phone": "1234567890",
    "message": "Test message"
  }'
```

## Notes

- Server runs on port 5000 by default
- CORS is enabled for frontend communication
- MongoDB connection uses the Stable API v1
- Graceful shutdown handling included

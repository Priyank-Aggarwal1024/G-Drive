# G-Drive Clone

A web application that allows users to create folders, upload images, and search through their images, similar to Google Drive.

## Features

- User authentication (signup, login, logout)
- Create nested folders
- Upload images to folders
- Search images by name
- User-specific access (users can only see their own folders and images)

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:

```bash
git clone <repository-url>
cd g-drive
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/g-drive
JWT_SECRET=your-secret-key
PORT=5000
```

5. Create an `uploads` directory in the backend folder:

```bash
mkdir backend/uploads
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm start
```

2. Start the frontend development server:

```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication

- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Folders

- GET `/api/folders` - Get all folders for the current user
- POST `/api/folders` - Create a new folder
- GET `/api/folders/:id` - Get folder by ID
- DELETE `/api/folders/:id` - Delete folder

### Images

- POST `/api/images` - Upload an image
- GET `/api/images` - Get all images for the current user
- GET `/api/images/search` - Search images by name
- GET `/api/images/:id` - Get image by ID
- DELETE `/api/images/:id` - Delete image

## Deployment

The application can be deployed using any cloud platform that supports Node.js and MongoDB. Some popular options include:

- Heroku
- DigitalOcean
- AWS
- Google Cloud Platform

## Security Considerations

- All API endpoints are protected with JWT authentication
- Passwords are hashed using bcrypt
- File uploads are restricted to image files only
- File size is limited to 5MB
- Users can only access their own folders and images

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

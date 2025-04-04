# G-Drive Backend

This is the backend for the G-Drive application, which provides file and folder management functionality with AWS S3 integration for file storage.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- AWS Account with S3 bucket

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:

   ```
   MONGODB_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   NODE_ENV=development

   # AWS Configuration
   AWS_REGION=your_aws_region
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_BUCKET_NAME=your_aws_bucket_name
   ```

### AWS S3 Setup

1. Log in to your AWS account
2. Go to the IAM (Identity and Access Management) service
3. Create a new IAM user or use an existing one
4. Create access keys for the user
5. Copy the access key ID and secret access key
6. Update the `.env` file with your actual AWS credentials
7. Create an S3 bucket in your AWS account
8. Update the `AWS_BUCKET_NAME` in the `.env` file to match your S3 bucket name
9. Configure CORS for your S3 bucket to allow requests from your application

#### S3 Bucket CORS Configuration

Add the following CORS configuration to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### Running the Application

1. Start the server:
   ```
   npm start
   ```
2. The server will be running on the port specified in the `.env` file (default: 3000)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get the current user

### Files

- `POST /api/files/upload` - Upload a file
- `GET /api/files` - Get all files
- `GET /api/files/:id` - Get a file by ID
- `DELETE /api/files/:id` - Delete a file
- `GET /api/files/:id/download` - Download a file
- `PATCH /api/files/:id/star` - Toggle star a file

### Folders

- `POST /api/folders` - Create a folder
- `GET /api/folders` - Get all folders
- `GET /api/folders/:id` - Get a folder by ID
- `PUT /api/folders/:id` - Update a folder
- `DELETE /api/folders/:id` - Delete a folder
- `PATCH /api/folders/:id/star` - Toggle star a folder

## Troubleshooting

### AWS S3 Issues

If you encounter issues with AWS S3 integration, check the following:

1. Make sure your AWS credentials are correct in the `.env` file
2. Verify that your S3 bucket exists and is accessible
3. Check that your IAM user has the necessary permissions to access the S3 bucket
4. Ensure that CORS is properly configured for your S3 bucket

### Testing AWS S3 Connection

You can test the AWS S3 connection by running:

```
node test-aws.js
```

This will check if your AWS credentials are valid and if the S3 bucket exists and is accessible.

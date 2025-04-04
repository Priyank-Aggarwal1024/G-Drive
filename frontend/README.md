# Drive Frontend

A modern and responsive frontend for a cloud storage application built with React, Tailwind CSS, and React Router.

## Features

- Modern and responsive UI
- File and folder management
- Grid and list view options
- File upload and download
- File sharing capabilities
- Search functionality
- Storage statistics
- Recent activity tracking
- Starred items management
- Pagination support

## Tech Stack

- React.js
- React Router for navigation
- Tailwind CSS for styling
- React Icons for icons
- Axios for API calls
- Context API for state management
- Custom hooks for reusable logic

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

## Project Structure

```
frontend/
├── public/            # Static files
│   └── src/
│       ├── components/    # Reusable components
│       │   ├── ui/       # UI components
│       │   └── layout/   # Layout components
│       ├── context/      # Context providers
│       ├── hooks/        # Custom hooks
│       ├── pages/        # Page components
│       ├── utils/        # Utility functions
│       ├── App.jsx       # Main application
│       └── index.jsx     # Entry point
```

## Key Components

### UI Components

- `FileView` - File item display with actions
- `FolderView` - Folder item display
- `Pagination` - Pagination controls
- `Toaster` - Toast notifications
- `FolderViewShimmer` - Loading skeleton

### Pages

- `Dashboard` - Main dashboard view
- `FolderView` - Folder contents view
- `Login` - User authentication
- `Register` - User registration

### Context

- `AuthContext` - Authentication state
- `DriveContext` - Drive operations

### Hooks

- `useDrive` - Drive operations
- `useFile` - File operations
- `useAuth` - Authentication operations

## Features Implementation

### File Operations

- Upload files
- Download files
- Delete files
- Rename files
- Share files
- Copy files
- Move files
- Star/unstar files

### Folder Operations

- Create folders
- Navigate folders
- Delete folders
- View folder contents

### User Interface

- Responsive grid and list views
- Search functionality
- Storage statistics
- Recent activity feed
- Loading skeletons
- Toast notifications

## Styling

The application uses Tailwind CSS for styling with a custom configuration:

- Responsive design
- Dark mode support
- Custom animations
- Consistent spacing and typography
- Modern UI components

## State Management

The application uses React Context API for state management:

- Authentication state
- Drive operations
- File operations
- UI state

## API Integration

The frontend communicates with the backend API using Axios:

- Authentication endpoints
- File operations
- Folder operations
- User statistics
- Activity tracking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

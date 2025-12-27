# Food Ordering App - Frontend

This is the frontend for the Food Ordering Application built with React, Vite, and Tailwind CSS.

## Features

- User authentication (Login/Signup)
- Browse menu items by category
- Add items to cart
- Place orders
- View order history
- Admin dashboard for managing orders and menu items

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL:
```
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── MenuItemCard.jsx
│   │   ├── Cart.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── context/          # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── CustomerDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Checkout.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles with Tailwind
├── package.json
└── .env.example
```

## User Roles

- **Customer**: Can browse menu, add items to cart, place orders, and view order history
- **Admin**: Can manage all orders and toggle menu item availability

## Technologies Used

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **Context API**: State management

## Available Routes

- `/login` - User login
- `/signup` - User registration
- `/customer` - Customer dashboard with menu
- `/admin` - Admin dashboard (admin only)
- `/checkout` - Order checkout page
- `*` - 404 Not Found page

## Notes

- Make sure the backend server is running before starting the frontend
- Default admin credentials should be created via backend seeding or manual database entry
- The app uses localStorage for token storage

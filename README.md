# Equipment Rental Management System

A modern, full-featured equipment rental management dashboard built with React, TypeScript, and Tailwind CSS.


## Features

- 🔐 **Role-Based Authentication**
  - Admin, Staff, and Customer access levels
  - Secure login system
  - Protected routes

- 📊 **Interactive Dashboard**
  - Real-time KPI monitoring
  - Equipment utilization charts
  - Maintenance status tracking
  - Revenue analytics

- 🚛 **Equipment Management**
  - Comprehensive inventory tracking
  - Equipment status monitoring
  - Detailed equipment profiles
  - Image gallery support

- 📅 **Rental System**
  - Easy rental creation and management
  - Calendar view for availability
  - Automated overdue tracking
  - Rental history

- 🔧 **Maintenance Tracking**
  - Scheduled maintenance planning
  - Maintenance history
  - Cost tracking
  - Status updates

- 🔔 **Notification System**
  - Real-time alerts
  - Overdue notifications
  - Maintenance reminders
  - System updates

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   https://github.com/arpit921/Equipment-Management-Dashboard.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Equipment-Management-Dashboard
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:5173
   ```

### Demo Credentials

Use these credentials to test different user roles:

```
Admin:
- Email: admin@entnt.in
- Password: admin123

Staff:
- Email: staff@entnt.in
- Password: staff123

Customer:
- Email: customer@entnt.in
- Password: cust123
```

## Technology Stack

- **Frontend Framework**: React 18
- **Type System**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Routing**: React Router v6
- **Charts**: Chart.js with React-Chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Code Quality**: ESLint

## Project Structure

```
src/
├── components/         # Reusable UI components
├── contexts/          # React Context providers
├── pages/             # Main application pages
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.tsx            # Root component
```

## Key Features Explained

### Equipment Management

- Track equipment status (Available, Rented, Maintenance, Reserved)
- Monitor equipment condition
- Calculate rental rates
- View rental history
- Schedule maintenance

### Rental System

- Create and manage rentals
- Track rental status
- Handle reservations
- Monitor overdue rentals
- Calculate rental costs

### Maintenance Tracking

- Schedule routine maintenance
- Track repair history
- Monitor maintenance costs
- Update equipment status

### User Management

- Role-based access control
- User authentication
- Profile management
- Activity tracking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- Stock photos from [Pexels](https://www.pexels.com)
- UI inspiration from various modern dashboard designs

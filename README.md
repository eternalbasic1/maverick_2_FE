# Milk Seller App - Production-Ready React Native App

A comprehensive milk delivery management app built with Expo React Native, featuring customer and admin interfaces for milk delivery management.

## 🚀 Features

### Customer Features

- **Home Dashboard**: Overview of subscription status, quick actions, and upcoming deliveries
- **Subscription Management**: View and update daily milk amounts, rate history
- **Skip Delivery**: Request to skip deliveries with reason selection
- **Billing History**: View monthly bills, rate breakdowns, and export options
- **Profile Management**: Update personal information and settings

### Admin Features

- **Admin Dashboard**: Daily statistics, pending actions, and recent activity
- **Delivery Schedule**: Manage daily deliveries, update status, bulk operations
- **Skip Requests**: Review and approve customer skip requests
- **Billing Reports**: Analytics, revenue tracking, and customer insights

### Technical Features

- **Authentication**: Phone number login with OTP verification
- **Professional UI**: Glassmorphism effects and modern design
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Query for server state, Context for app state
- **Navigation**: Stack and Tab navigation with proper typing
- **Form Validation**: Yup schema validation with React Hook Form
- **Error Handling**: Comprehensive error handling and loading states

## 🛠️ Tech Stack

- **Framework**: Expo React Native
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: React Query + Context API
- **Forms**: React Hook Form + Yup
- **UI**: Custom components with glassmorphism effects
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios
- **Icons**: Expo Vector Icons

## 📱 Project Structure

```
MilkSellerApp/
├── App.tsx                          # Main app component
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── babel.config.js                  # Babel configuration
├── index.ts                         # Entry point
└── src/
    ├── components/                  # Reusable UI components
    │   ├── common/                  # Common components
    │   ├── forms/                   # Form components
    │   ├── glassmorphism/           # Glassmorphism components
    │   └── ui/                      # UI components
    ├── config/                      # Configuration files
    ├── context/                     # React Context providers
    ├── hooks/                       # Custom hooks
    ├── navigation/                  # Navigation setup
    ├── screens/                     # Screen components
    │   ├── auth/                    # Authentication screens
    │   ├── customer/                # Customer screens
    │   └── admin/                   # Admin screens
    ├── services/                    # API services
    ├── theme/                       # Theme and styling
    ├── types/                       # TypeScript types
    └── utils/                       # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MilkProject_FE2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a Firebase project
   - Enable Authentication with Phone Number
   - Update `src/config/firebase.ts` with your Firebase config
   - Set up environment variables for Firebase keys

4. **Configure API**

   - Update `src/utils/constants.ts` with your API base URL
   - Set up environment variables for API configuration

5. **Start the development server**

   ```bash
   npm start
   ```

6. **Run on device/simulator**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://api.milkseller.com
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication with Phone Number
3. Configure reCAPTCHA for React Native
4. Update Firebase configuration in `src/config/firebase.ts`

## 📱 Screens Overview

### Authentication Screens

- **LoginScreen**: Phone number and password login
- **SignupScreen**: User registration with OTP verification
- **ForgotPasswordScreen**: Password reset with OTP

### Customer Screens

- **HomeScreen**: Dashboard with subscription overview
- **SubscriptionScreen**: Manage daily milk amounts and rates
- **SkipRequestScreen**: Request to skip deliveries
- **BillingHistoryScreen**: View bills and payment history
- **ProfileScreen**: User profile and settings

### Admin Screens

- **AdminDashboardScreen**: Admin overview and statistics
- **DeliveryScheduleScreen**: Manage daily deliveries
- **AllSkipRequestsScreen**: Review skip requests
- **BillingReportScreen**: Analytics and reporting

## 🎨 Design System

### Color Palette

- **Primary**: Professional Blue (#2563EB)
- **Secondary**: Professional Green (#059669)
- **Success**: Green (#059669)
- **Warning**: Orange (#D97706)
- **Error**: Red (#DC2626)
- **Background**: Clean white system

### Typography

- **Display**: Large, medium, small variants
- **Headline**: Large, medium, small variants
- **Title**: Large, medium, small variants
- **Body**: Large, medium, small variants
- **Label**: Large, medium, small variants

### Components

- **GlassCard**: Glassmorphism card component
- **GlassButton**: Glassmorphism button component
- **FormInput**: Professional form input with validation
- **LoadingSpinner**: Loading state component
- **EmptyState**: Empty state component

## 🔐 Authentication Flow

1. **Phone Number Input**: User enters phone number with country code
2. **OTP Verification**: 6-digit OTP sent via SMS
3. **Password Setup**: User sets secure password
4. **Token Management**: Automatic token refresh and secure storage
5. **Session Management**: Automatic logout on token expiry

## 📊 API Integration

### Authentication APIs

- `POST /auth/login/` - User login
- `POST /auth/signup/` - User registration
- `POST /auth/forgot-password/` - Password reset
- `POST /auth/refresh/` - Token refresh

### Customer APIs

- `GET /subscription/` - Get subscription details
- `POST /subscription/` - Create subscription
- `POST /subscription/update-rate/` - Update daily rate
- `GET /subscription/billing-history/` - Get billing history
- `POST /skip/` - Create skip request
- `GET /skip/list/` - Get skip requests
- `DELETE /skip/{id}/` - Cancel skip request

### Admin APIs

- `GET /admin/schedule/` - Get delivery schedule
- `GET /admin/skip-requests/` - Get all skip requests
- `PUT /admin/update-deliveries/` - Update delivery status
- `GET /admin/billing-report/` - Get billing report

## 🚀 Deployment

### Development

```bash
npm start
```

### Production Build

```bash
# iOS
expo build:ios

# Android
expo build:android
```

### App Store Deployment

1. Configure production Firebase
2. Set up environment variables
3. Build for production
4. Test on real devices
5. Deploy to app stores

## 📝 Development Notes

1. **Copy the exact same structure from Chitledger_FE**
2. **Use identical color palette and typography**
3. **Implement same authentication flow**
4. **Use same navigation patterns**
5. **Follow same component architecture**
6. **Implement same error handling**
7. **Use same loading states and animations**

## 🔧 Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **Firebase configuration**: Ensure all environment variables are set
3. **Navigation issues**: Check screen names and parameters
4. **TypeScript errors**: Run `npx tsc --noEmit` to check types

### Debug Commands

```bash
# Clear Expo cache
expo start -c

# Check TypeScript
npx tsc --noEmit

# Check dependencies
npm audit

# Update dependencies
npm update
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Expo React Native**

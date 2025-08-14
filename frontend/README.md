# Freelance Marketplace Frontend

A modern, responsive freelance marketplace website built with ReactJS, TypeScript, and Tailwind CSS. This frontend application simulates core features of a freelancing platform using mock data and provides an excellent foundation for connecting with smart contracts.

## 🚀 Features

### Core Functionality
- **Job Browsing**: Search and filter jobs by category, budget, experience level, and location
- **Freelancer Profiles**: Detailed profiles with portfolio, skills, reviews, and ratings
- **Job Posting**: Comprehensive form for clients to post new job opportunities
- **User Authentication**: Login and signup system with form validation
- **Dashboard**: Personalized dashboard for both clients and freelancers
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization

### Technical Features
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for smooth animations and transitions
- **Formik + Yup** for form handling and validation
- **React Router** for client-side routing
- **Context API** for state management
- **Dark Mode** support with theme switching
- **Component-based** architecture for reusability

### UI/UX Features
- **Modern Design**: Clean, professional interface with intuitive navigation
- **Interactive Elements**: Hover effects, transitions, and micro-animations
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: User-friendly error messages and validation feedback

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: Formik + Yup
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API
- **Package Manager**: npm

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components
│   │   └── ...            # Feature-specific components
│   ├── contexts/          # React Context providers
│   ├── data/              # Mock data and interfaces
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions and helpers
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd projectfl/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Customization

### Styling
- **Colors**: Modify the color palette in `tailwind.config.js`
- **Fonts**: Update font families in `tailwind.config.js`
- **Components**: Customize component styles in `src/index.css`

### Data
- **Mock Data**: Update mock data in `src/data/mockData.ts`
- **Interfaces**: Modify TypeScript interfaces as needed
- **Validation**: Adjust form validation schemas in individual components

### Features
- **New Pages**: Add new routes in `src/App.tsx`
- **Components**: Create reusable components in `src/components/`
- **Utilities**: Add helper functions in `src/utils/helpers.ts`

## 🔗 Smart Contract Integration

This frontend is designed to integrate with the Aptos Move smart contract located at `../contract/sources/message_board.move`. The smart contract provides:

- **Job Escrow System**: Secure payment handling for freelance jobs
- **Job Management**: Create, complete, and retrieve job information
- **Error Handling**: Comprehensive error codes for various scenarios

### Integration Points
- **Job Creation**: Connect job posting form with smart contract
- **Job Completion**: Integrate job completion workflow
- **Payment Processing**: Handle escrow payments through smart contract
- **Data Fetching**: Retrieve job information from blockchain

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:

- **Mobile**: Optimized for small screens with touch-friendly interactions
- **Tablet**: Responsive layouts for medium-sized devices
- **Desktop**: Full-featured experience with advanced navigation

## 🌙 Dark Mode

The application includes a built-in dark mode that:

- **Automatic Detection**: Respects system preferences
- **Manual Toggle**: User can switch between light and dark themes
- **Persistent**: Remembers user's theme preference
- **Smooth Transitions**: Elegant theme switching animations

## 🧪 Testing

The application includes comprehensive testing setup:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

Run tests with:
```bash
npm test
```

## 📦 Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy to your hosting platform**
   - Vercel, Netlify, or any static hosting service
   - Upload the `dist` folder contents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Contact the development team

## 🚀 Future Enhancements

- **Real-time Chat**: Implement WebSocket-based messaging
- **File Upload**: Add file sharing capabilities
- **Payment Integration**: Connect with payment gateways
- **Advanced Search**: Implement Elasticsearch or similar
- **Mobile App**: React Native version
- **Internationalization**: Multi-language support
- **Analytics**: User behavior tracking and insights

---

**Built with ❤️ using modern web technologies**

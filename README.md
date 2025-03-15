# Insurance Portal

A modern web application for managing insurance policies and claims, built with React, TypeScript, and Vite.

## Features

- Modern UI components using Radix UI
- Responsive design with Tailwind CSS
- Type-safe development with TypeScript
- Client-side routing with React Router
- Date handling with date-fns
- Toast notifications for user feedback
- Form components and validation
- Dark mode support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd insurance-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Build for production:
   ```bash
   npm run build
   # or
   yarn build
   ```

5. Preview production build:
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## Project Structure

```
insurance-portal/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── layouts/       # Layout components
│   ├── lib/           # Utility functions and configurations
│   └── App.tsx        # Main application component
└── index.html         # Entry HTML file
```

## API Usage

This project is currently set up as a frontend-only application. To integrate with a backend API:
1. Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Configure the API base URL in your `.env` file:
   ```bash
   VITE_API_BASE_URL=http://your-api-url.com/api
   ```

   Note: All environment variables must be prefixed with `VITE_` to be accessible in the application.



## Assumptions

1. **Browser Support**: The application is designed for modern browsers that support ES6+ features.
2. **Screen Resolution**: The UI is optimized for desktop and tablet views (1024px and above).
3. **JavaScript**: The application requires JavaScript to be enabled in the browser.
4. **API Integration**: The application assumes a RESTful API backend with JSON responses.
5. **Authentication**: User authentication is handled through JWT tokens stored in localStorage.

## Development Guidelines

1. **Code Style**: Follow the existing TypeScript and React patterns in the codebase.
2. **Component Structure**: Use functional components with hooks for state management.
3. **Styling**: Utilize Tailwind CSS classes and follow the existing design system.
4. **Type Safety**: Maintain strict TypeScript types and interfaces.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute the code for both commercial and non-commercial purposes.

## Support

For support, please contact [Your Contact Information]



# 🛍 Smithshop

An elegant marketplace web application for gaming and social media assets built on top of **Next.js**.

[![TypeScript](https://img.shields.io/badge/TypeScript-98.9%25-3178C6?style=flat-square&logo=typescript)](/)
[![Other](https://img.shields.io/badge/Other-1.1%25-555555?style=flat-square)](/)
[![Next.js](https://img.shields.io/badge/Next.js-Latest-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwindcss](https://img.shields.io/badge/Tailwind%20CSS-Latest-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-Latest-000000?style=flat-square)](https://better-auth.js.org)
[![Shadcn/UI](https://img.shields.io/badge/Shadcn%2FUI-Components-000000?style=flat-square)](https://ui.shadcn.com)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- 🎮 **Gaming Assets Marketplace** - Browse and purchase gaming-related digital assets
- 📱 **Social Media Assets** - Discover premium social media content and resources
- 💳 **Secure Transactions** - Safe and reliable payment processing
- 🔐 **User Authentication** - Secure user accounts and profiles with Better Auth
- ⚡ **Fast Performance** - Server-side rendering and static generation with Next.js
- 📱 **Responsive Design** - Mobile-first, fully responsive interface
- 🔍 **Advanced Search & Filtering** - Filter and search through marketplace items
- ⭐ **Ratings & Reviews** - Community feedback and ratings system
- 🔍 **Admin Panel** - For user and product management
- ❤️ **Favourites Functionality** - Save and manage favorite items

---

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework for production
- **React 18+** - UI library
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Styling and responsive design
- **Shadcn/UI** - Beautiful, accessible UI components

### Backend & Database
- **Prisma ORM** - Database management and migrations
- **Better Auth** - Authentication and authorization
- **API Routes** - Next.js serverless functions

### Development
- **Server-side Rendering (SSR)** - Dynamic content rendering
- **Static Site Generation (SSG)** - Pre-built static pages

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.x or higher)
- **npm** or **yarn** package manager
- **Git**

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aman-a-dev/smithshop.git
   cd smithshop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables in `.env.local`.

4. **Initialize the database (if using Prisma):**
   ```bash
   npx prisma migrate dev
   ```

---

## ▶️ Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The application will automatically reload when you make changes to the code.

---

## 💻 Development

### Project Structure

```
smithshop/
├── app/                # Next.js app directory
├── components/         # Reusable React components
├── lib/                # Utility functions and helpers
├── public/             # Static assets
├── data/               # Products data
├── .env.local          # Environment variables (local)
├── package.json        # Project dependencies
└── prisma/             # Prisma schema and migrations
```

### Code Style

This project uses TypeScript for type safety and follows modern React best practices with ESLint and Prettier.

---

## 🏗️ Building for Production

Build the application for production:
```bash
npm run build
# or
yarn build
```

Start the production server:
```bash
npm start
# or
yarn start
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's TypeScript conventions and is well-tested.

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 📧 Contact & Support

For questions, suggestions, or support, please open an issue on the [GitHub repository](https://github.com/aman-a-dev/smithshop/issues).

---

## 🎯 Roadmap

- [x] Core marketplace functionality
- [x] User authentication
- [ ] Advanced filtering and sorting
- [ ] Payment gateway integration
- [ ] User dashboard
- [ ] Admin dashboard
- [ ] Wishlist functionality
- [ ] Reviews and ratings system
- [ ] Seller dashboard
- [ ] Analytics and reporting

---

**Happy Shopping! 🛍️**

# 🚀 My Next.js 15 Full Stack Todo App

> **A project I built to learn and master the latest features of Next.js 15, React 19, and Full Stack Development.**

![Project Status](https://img.shields.io/badge/Status-Learning_Project-success?style=flat-square&logo=git)
![Next.js](https://img.shields.io/badge/Next.js-15.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)
![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux)

## 👋 About This Project

Hi there! This is a **Full Stack Todo Application** that I built as my capstone project while following the **Next.js 15 Complete Course**.

I wanted to go beyond just a simple "Hello World" app and really understand how a real-world application is put together. My main goal was to learn how to build a Backend-for-Frontend (BFF) architecture where Next.js handles both the UI and the API calls.

**Key things I tried to achieve:**
*   Move away from just frontend and understand **Backend logic**.
*   Learn how **Authentication** actually works under the hood (Cookies, Sessions, Hashing) without just using a library like Auth.js immediately.
*   Get comfortable with **TypeScript** for strict type checking.
*   Make the UI look good using **Tailwind CSS**.

---

## 🛠️ Tech Stack & What I Used

Here are the tools and technologies I used to build this:

### Frontend
*   **Next.js 15 (App Router)**: The core framework using the latest file-system based routing and Server Components.
*   **React 19**: Using the latest React features like `useActionState` (conceptually) and optimized rendering.
*   **Redux Toolkit & RTK Query**: For managing global state and caching API responses efficiently on the client.
*   **Tailwind CSS v4**: For writing utility-first CSS and building a responsive layout quickly.
*   **Framer Motion**: For adding smooth animations to UI interactions.
*   **Sonner**: A library for clean, nice-looking toast notifications.
*   **Lucide React**: For consistent and beautiful SVG icons.

### Backend
*   **Node.js**: Running the API logic.
*   **Route Handlers**: Creating REST API endpoints (`/api/todos`, `/api/auth`) directly inside Next.js.
*   **MongoDB Atlas**: My cloud database of choice.
*   **Mongoose**: An ODM to modeling my data with strict schemas (For Users, Todos, and Sessions).
*   **Bcrypt**: For hashing passwords securely before saving them to the database.
*   **Zod**: For validating data coming from the frontend to ensure it's correct.

---

## ✨ Features I Implemented

### 🔐 Authentication (From Scratch!)
Instead of just wrapping a library, I implemented a custom auth flow to understand it better:
*   **Signup & Login**: Users can create an account and log in.
*   **Sessions**: I used HTTP-Only cookies to store session IDs securely. This helps prevent XSS attacks.
*   **Middleware**: I added logic to check if a user is logged in before letting them access the dashboard. If not, they are redirected to the login page.
*   **Security**: Passwords are hashed using `bcrypt` before being saved to the DB.

### 📝 Task Management
*   **CRUD Operations**: You can Create, Read, Update, and Delete tasks.
*   **Private Data**: You can only see your own tasks. The API checks your Session ID to know who you are before fetching data.
*   **Real-time Updates**: When you add a task, the UI updates almost instantly thanks to optimistic updates/caching.

### 🎨 UI/UX
*   **Dark & Light Mode**: Added a toggle because every dev app needs dark mode! 🌙
*   **Responsive**: It works on mobile, tablet, and desktop screens.
*   **Toast Notifications**: Added popups (using Sonner) so you know when a task is saved or if there was an error.
*   **Loading States**: Added skeletons and loading spinners so the app feels responsive even when data is fetching.

---

## 🔌 API Routes I Built

I created a full REST API for this project. Here are the endpoints I implemented:

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Log in and get a session cookie | Public |
| `GET` | `/api/auth/me` | Get current user info (if logged in) | Private |
| `POST` | `/api/auth/logout` | Destroy the session cookie | Private |
| `GET` | `/api/todos` | Get all my tasks | Private |
| `POST` | `/api/todos` | Create a new task | Private |
| `PUT` | `/api/todos/[id]` | Update a task (done/undone) | Private |
| `DELETE` | `/api/todos/[id]` | Delete a task | Private |

---

## 📂 Complete Project Structure

Here is the exact structure of my project files:

```text
src/
├── app/
│   ├── api/                     # Backend API Routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts     # POST: Login Logic
│   │   │   ├── logout/
│   │   │   │   └── route.ts     # POST: Logout Logic
│   │   │   ├── me/
│   │   │   │   └── route.ts     # GET: Validate Session
│   │   │   └── signup/
│   │   │       └── route.ts     # POST: Register User
│   │   └── todos/
│   │       ├── [id]/            # Dynamic Route for specific todo
│   │       │   └── route.ts     # PUT & DELETE Handlers
│   │       └── route.ts         # GET & POST Handlers
│   ├── login/
│   │   └── page.tsx             # Login Page UI
│   ├── signup/
│   │   └── page.tsx             # Signup Page UI
│   ├── globals.css              # Global styles & Tailwind
│   ├── layout.tsx               # Root layout (Metadata, Fonts, Providers)
│   └── page.tsx                 # Main Dashboard Page
├── components/
│   ├── Navbar.tsx               # Top navigation bar
│   ├── ThemeToggle.tsx          # Dark/Light mode switch
│   ├── TodoApp.tsx              # Main container for Todo logic
│   ├── TodoInput.tsx            # Input form component
│   └── TodoItem.tsx             # Individual todo item component
├── features/
│   ├── auth/
│   │   └── authApi.ts           # Redux RTK Query for Auth
│   └── todos/
│       └── todoApi.ts           # Redux RTK Query for Todos
├── hooks/
│   └── useHydrated.ts           # Custom hook for Hydration check
├── lib/
│   ├── auth.ts                  # Session signing & verification helpers
│   ├── connectDB.ts             # MongoDB Cache/Singleton Connection
│   └── utils.ts                 # Tailwind class merger (cn)
├── models/
│   ├── sessionModel.ts          # Mongoose Schema for Sessions
│   ├── todoModel.ts             # Mongoose Schema for Todos
│   └── userModel.ts             # Mongoose Schema for Users
├── providers/
│   ├── ReduxProvider.tsx        # Redux Context Wrapper
│   └── ThemeProvider.tsx        # Next-Themes Wrapper
├── store/
│   ├── api/
│   │   └── baseApi.ts           # Base RTK Query setup
│   └── store.ts                 # Global Store configuration
├── types/
│   ├── global.d.ts              # Global type augmentations
│   └── todo.ts                  # Shared TypeScript interfaces
├── .env.local                   # Environment secrets
├── middleware.ts                # Route protection middleware
├── next.config.ts               # Next.js config
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind config
└── tsconfig.json                # TypeScript config
```

---

## 🎓 What I Learned

This project helped me solidify a lot of concepts from the course. Here is a comprehensive list of what I implemented:

### 1. Next.js Core & Routing
*   **App Router**: I specifically didn't use the old `pages` directory. I learned how to use the special files like `layout.tsx` for wrapping my app and `page.tsx` for the UI.
*   **Dynamic Routing**: I utilized square brackets `[id]` to handle individual todo items (`/api/todos/[id]`), which allows me to delete or update specific tasks.
*   **Route Groups**: I learned how to organize my files logically without affecting the URL structure (though simpler folder based routing was enough here!).
*   **Metadata API**: Instead of the old `Head` component, I used the Metadata API in `layout.tsx` to set the page title and description for SEO.

### 2. Rendering Strategies
*   **Server Components (RSC)**: By default, all my pages are Server Components. This keeps the initial bundle size small.
*   **Client Components**: I learned exactly when to use `"use client"`. I had to use it for my `Navbar` (because it needs to know if I'm logged in) and `TodoInput` (because it needs to handle form state).
*   **Hydration**: I encountered hydration errors initially because of the Theme Toggle (Local Storage vs Server HTML), and solved it using a `useHydrated` hook to wait for the client to be ready.

### 3. Backend & Data Fetching
*   **Route Handlers**: I built a complete REST API effectively replacing Express.js. I handle `GET`, `POST`, `PUT`, and `DELETE` requests using the standard Web Request/Response API.
*   **Database Connections**: I learned that serverless functions can open too many DB connections. I implemented a **Singleton Pattern** in `lib/connectDB.ts` to reuse the existing connection effectively.
*   **Mongoose Models**: I used strict schemas for my data. For example, my `Todo` model links back to a `User` using `ref: "User"`, basically creating a relational link in a NoSQL database.

### 4. Advanced Authentication
*   **Manual Auth Flow**: Instead of using Clerk or NextAuth immediately, I built this manually to understand the core concepts.
*   **Password Hashing**: I used `bcrypt` to salt and hash passwords so they are never stored as plain text.
*   **Sessions**: I created a `Session` collection in MongoDB. When a user logs in, I create a session and store the ID in a signed, HTTP-Only cookie.
*   **Middleware Protection**: I wrote a `middleware.ts` file that intercepts requests. If you try to visit `/` without that cookie, it kicks you back to `/login`.

### 5. State Management & API Caching
*   **Redux Toolkit**: I set up a global store to manage the application state.
*   **RTK Query**: This was the biggest learning. I didn't need `useEffect` to fetch data. RTK Query handles the fetching, caching, and invalidating of tags (e.g., when I add a todo, it automatically re-fetches the list).

### 6. Styling with Tailwind
*   **Dark Mode**: I implemented dark mode support using `next-themes` and Tailwind's `dark:` modifier.
*   **Utility First**: I avoided writing custom CSS files (except for `globals.css`) and used utility classes for everything, which made development very fast.

---

## ⚡ How to Run It

If you want to check out my code or run it locally:

1.  **Clone the repo**
    ```bash
    git clone https://github.com/yourusername/nextjs-todo-app.git
    cd nextjs-todo-app
    ```

2.  **Install packages**
    ```bash
    npm install
    # or pnpm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root and add your MongoDB URL:
    ```env
    MONGO_URI=your_mongodb_connection_string
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```

4.  **Run it!**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to see it in action.

---

Built by **[Nirbhay Marde](https://github.com/nirbhay21)** while learning Next.js. 🚀
*(Frontend designed and built with the assistance of AI)*

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

## � API Routes I Built

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

## �📂 How I Organized My Code

I tried to keep the folder structure clean and modular. Here is a quick overview:

```text
src/
├── app/                 # The new Next.js 15 App Router
│   ├── api/             # My backend routes (where the magic happens)
│   │   ├── auth/        # Login/Signup/Logout/Me endpoints
│   │   └── todos/       # Task management endpoints ([id] for dynamic routes)
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   ├── layout.tsx       # Main layout (Providers, Fonts, Metadata)
│   └── page.tsx         # The main Dashboard (Protected Route)
├── components/          # Reusable UI parts
│   ├── Navbar.tsx       # The top navigation bar
│   ├── TodoItem.tsx     # Component for a single task
│   └── ...
├── features/            # Redux Slices (connecting FE to BE)
├── lib/                 # Helper functions
│   ├── connectDB.ts     # Database connection logic
│   └── auth.ts          # Session helper functions
├── models/              # Mongoose Schemas (User, Todo, Session)
├── providers/           # wrappers for Redux and Theme
└── types/               # TypeScript definitions
```

---

## 🎓 What I Learned

This project helped me solidify a lot of concepts from the course:

1.  **Routing paradigms**: I finally understand the difference between `page.tsx`, `layout.tsx` and how nested routes work. I also learned about **Dynamic Routing** (like `[id]`) to handle specific items.
2.  **Server Components vs Client Components**: This was tricky at first! I learned that I should use **Client Components** (`"use client"`) only when I need interactivity (like `useState`, `onClick`, hooks), and keep everything else as **Server Components** for better performance and SEO.
3.  **API Routes**: I learned how to handle `POST`, `GET`, `PUT`, and `DELETE` requests directly in Next.js using `Route Handlers`. I learned how to read the `Request` body and send back a `Response`.
4.  **Database Connection**: Connecting Next.js to MongoDB was cool. I learned how to prevent opening too many connections (which can crash the app) by using a caching/singleton pattern in `connectDB.ts`.
5.  **Data Fetching**: Using **RTK Query** was a game changer. It automatically caches the data so the app feels super fast and I don't have to manually manage `isLoading` states everywhere.

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

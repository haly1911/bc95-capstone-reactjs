# Lumière

A movie ticket booking web application built as a Capstone project, covering the full flow from browsing movies to picking seats and booking tickets, plus an admin dashboard for managing content.

🔗 **Live demo:** https://lumiere-bc95-capstone-reactjs.vercel.app/

## Tech Stack

- **Framework:** React 19 + Vite
- **Routing:** React Router
- **State Management:** Redux Toolkit
- **Data Fetching:** TanStack React Query, Axios
- **Form & Validation:** Formik, Yup
- **Styling & UI:** Tailwind CSS, Swiper, React Toastify

## Key Features

- **Movie Browsing:** Search, filter by status (now showing, coming soon, hot), pagination, trailer popup and detailed movie pages with showtimes grouped by cinema chain.
- **Interactive Seat Selection:** Seat map rendered from API data with regular, VIP, selected and sold seats, plus a live booking summary and total price.
- **Booking & Payment:** Ticket booking flow with a payment step (payment methods are simulated) and card form validation.
- **Authentication:** Login and register with form validation. Guests are redirected to sign in during checkout and returned to their booking afterwards. Login state persists across reloads.
- **User Profile:** View and edit account information, with a full booking history.
- **Admin Dashboard:** Role-protected area to manage users and movies (CRUD) and to create new showtimes.

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/haly1911/bc95-capstone-reactjs.git
cd bc95-capstone-reactjs
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:5173 to view it in your browser.
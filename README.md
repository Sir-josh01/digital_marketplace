## 🛒 Premium Digital Assets E-Commerce
A high-performance, Single Page Application (SPA) designed for selling digital products like scripts, templates, and UI kits. This project features a modern React frontend and a robust PHP/MySQL backend, focusing on a seamless user experience and "appealing" visual aesthetics.

## 🚀 Core Features
Dynamic Inventory: Live product fetching from a MySQL database via a PHP PDO API.

Intelligent Cart: An "Upsert-capable" shopping cart that handles quantity increments, decrements, and auto-removal.

Real-time Filtering: Category-based chips and live search functionality for instant product discovery.

Optimized UX: Skeleton loading states to prevent layout shift and a slide-out cart sidebar for quick management.

Responsive Design: Fully prepared for Light/Dark mode transitions with a focus on high-end UI aesthetics.

## 🛠️ Tech Stack
**Frontend**: React (State Lifting, Context-like props management, Axios).

**Backend**: PHP (RESTful API approach, PDO for SQL injection protection).

**Database**: MySQL (Relational schema for products and cart persistence).

**Styling**: Modern CSS3 using Variables for easy theme switching.

## Problems it is meant to solve: 
Bridges the gap between static digital marketplaces and dynamic, state-driven web applications by providing a real-time shopping experience without page reloads.

## Challenges encountered:
 Synchronizing asynchronous backend database states with the React Virtual DOM, specifically regarding unique key reconciliation and quantity "upsert" logic.
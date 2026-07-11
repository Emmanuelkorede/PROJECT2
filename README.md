# Full-Stack Todo & Notes Application

This is a personal, hands-on practice project built to master full-stack development. It features a complete architecture consisting of a secure backend API, a relational database, and a dynamic, state-managed frontend user interface.

> ⚠️ **Important Note on Running Locally:** > The database and server configurations in this repository are set up strictly for my local environment (`localhost`). It will not run out of the box on another machine without configuring your own PostgreSQL database connection strings and environment variables.



## 🚀 Project Overview

The goal of this project was to move away from basic tutorial clones and build a real-world, secure application from scratch. I handled everything from database schema design and writing custom SQL queries to managing complex React component state transitions.

### Key Features Implemented:
* **Full CRUD Operations:** Create, Read, Update, and Delete todo tasks.
* **Authentication & Security:** User registration and login utilizing JWT (JSON Web Tokens) stored securely in `localStorage` and verified via backend middleware.
* **Inline Editing State Machine:** Conditional rendering logic that allows users to seamlessly edit existing titles, content, and categories directly inside the list view without page redirects.
* **Instant Status Toggling:** A custom `PATCH` endpoint implementation that enables users to toggle task completion states with immediate UI updates.
* **Multi-Parameter Filtering:** Dynamic backend query building using PostgreSQL to filter tasks concurrently by both Category (Work, Personal, Shopping) and Status (Completed, Incomplete).

---

## 🛠️ Tech Stack Used

* **Frontend:** React, TypeScript, Tailwind CSS, Axios, React Router
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (with `pg` connection pooling)
* **Authentication:** JWT (JsonWebToken)

---

## 💡 What I Learned From This Project

Building this application was a major learning milestone that took days of intense debugging and trial-and-error:
* **The Full-Stack Bridge:** Learned exactly how data maps between frontend Axios requests (`req.body` payload objects) and backend Express destructured parameters.
* **Database Query Architecture:** Mastered dynamic SQL generation in PostgreSQL using parameter arrays (`$1`, `$2`) to safely filter queries without exposing the application to SQL injection.
* **State Synchronization:** Traced and resolved synchronization bugs involving React's `useEffect` dependencies, state variables initialization, and unexpected `500/404` server responses.
* **Resilience:** Gained valuable experience reading terminal errors, checking network tabs, and tracing data flows systematically to fix complex, interconnected bugs.

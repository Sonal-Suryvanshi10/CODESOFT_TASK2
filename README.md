# 💰 Expense Tracker

A modern and responsive Personal Expense Tracker that helps users manage their income and expenses, track transactions, and get a quick overview of their financial status.

The application uses Firebase Authentication for user accounts and Cloud Firestore to securely store user-specific transaction data in the cloud.

## ✨ Features

* 🔐 User Authentication
    * Create a new account using name, email, and password
    * Login using email and password
    * Secure logout functionality
    * User-specific transaction data

* 📊 Financial Summary
    * Total Income
    * Total Expenses
    * Current Balance

* ➕ Add Transactions
    * Add income and expense transactions
    * Enter amount, category, date, and description

* 📝 Edit Transactions
    * Update existing transaction details whenever required
    * Edit amount, category, date, type, and description

* 🗑️ Delete Transactions
    * Remove unwanted transactions from the history

* 🔍 Category Filtering
    * Filter transactions based on categories such as Salary, Food, Travel, Shopping, Bills, Education, Entertainment, and more

* 📅 Transaction History
    * View transactions with date, category, type, amount, and description
    * Transactions are displayed with the latest dates first

* ☁️ Cloud Firestore
    * Transaction data is stored in Cloud Firestore
    * Each user's transactions are linked with their Firebase User ID
    * Data updates automatically in real time

* 🌙 Dark Mode
    * Switch between Light and Dark themes
    * Theme preference is saved using Local Storage

* 👤 Profile & Settings
    * View logged-in user's name and email
    * Access account settings
    * Toggle Dark Mode from settings

* 📱 Responsive Design
    * Optimized for desktops, tablets, and mobile devices

* 🎨 Modern UI
    * Clean dashboard
    * Gradient-based design
    * Responsive layout
    * Smooth hover and transition effects
    * User-friendly interface

## 🛠️ Technologies Used

* HTML5 — Structure
* CSS3 — Styling and responsive design
* JavaScript (ES6+) — Application functionality
* Firebase Authentication — User authentication
* Cloud Firestore — Cloud database
* Local Storage — Theme preference
* Font Awesome — Icons
* Google Fonts — Typography


## 📂 Project Structure

expense-tracker/
│
├── index.html      # Main application structure
├── style.css       # Styling and responsive design
├── script.js       # Application functionality
└── README.md       # Project documentation


## 🚀 How to Run

1. Clone the repository:

git clone https://github.com/sonal-suryvanshi10/CODESOFT_TASK2.git

2. Open the project folder:

cd CODESOFT_TASK2

3. Open the `EXPENSE-TRACKER` folder.

4. Run `index.html` using a local development server such as VS Code Live Server.

5. Create an account or login to start using the application.


## 💡 How It Works

1. Create an account or login using Firebase Authentication.
2. Add an Income or Expense transaction.
3. Enter the amount, category, date, and description.
4. The transaction is stored in Cloud Firestore.
5. The dashboard automatically updates:
    * Total Income
    * Total Expenses
    * Current Balance
6. Transactions can be edited or deleted at any time.
7. Use the category filter to view specific transactions.
8. Toggle between Light and Dark mode from the header or Settings.


## 📊 Financial Calculation

The application calculates the financial summary automatically:

Current Balance = Total Income - Total Expenses

For example:

Total Income      = ₹30,000
Total Expenses    = ₹8,500
Current Balance   = ₹21,500


## ☁️ Data Storage

This project uses **Cloud Firestore** to store transaction data.

Each transaction is associated with the logged-in user's Firebase User ID, ensuring that users can access their own transaction data after logging in.

The selected Light/Dark theme preference is stored locally using the browser's Local Storage.


## 🔐 Authentication

Firebase Authentication is used for:

* User Signup
* User Login
* Password-based authentication
* User session management
* Logout
* User display name

Users can only load and manage their own transactions through their Firebase User ID.


## 📱 Responsive Design

The interface is designed to work across different screen sizes:

* 💻 Desktop
* 📱 Mobile
* 📲 Tablet

The layout automatically adapts according to the screen size for a better user experience.


## 🎯 Project Objective

The main objective of this project is to build a practical financial management application while demonstrating:

* Firebase Authentication
* Cloud Firestore
* DOM manipulation
* JavaScript event handling
* CRUD operations
* Real-time data updates
* Local Storage
* Dynamic UI updates
* Category-based filtering
* Responsive web design


## 🔮 Future Improvements

* 📈 Expense charts and visual analytics
* 📊 Monthly and yearly financial reports
* 💾 Export transactions as CSV or PDF
* 🔔 Budget and spending notifications
* 📅 Advanced date-based filtering
* 📱 Progressive Web App (PWA) support


## 👩‍💻 Author

Sonal Suryvanshi

B.Tech Computer Science & Engineering


---

⭐ If you find this project useful, consider giving the repository a star!

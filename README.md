# API Security Scanner

This project is an **API Security Scanner** built using the **MERN stack**. It scans APIs for vulnerabilities such as missing authentication, weak authorization, lack of rate limiting, data exposure, and CORS misconfigurations. The project is designed to automate API security testing and provide a security score based on the vulnerabilities found.

---

## Features

- **Frontend**: Built with React and Vite for a fast and responsive user interface.
- **Backend**: Node.js and Express.js for handling API requests and scanning logic.
- **Database**: MongoDB for storing scan reports and results.
- **Security Checks**:
  - Authentication
  - Authorization
  - Rate Limiting
  - Data Exposure
  - CORS Misconfigurations
- **Security Score**: Calculates a score based on the severity of vulnerabilities found.
- **Responsive Design**: Works across devices.

---

## Technologies Used

### **Frontend**
- React
- Vite
- Axios
- CSS3

### **Backend**
- Node.js
- Express.js
- Axios
- MongoDB
- Mongoose

---

## Project Structure

```
hackathon11/
├── backend/
│   ├── .env                # Environment variables
│   ├── server.js           # Backend entry point
│   ├── controllers/        # API controllers
│   │   └── scannerController.js
│   ├── models/             # MongoDB models
│   │   └── ScanReport.js
│   ├── routes/             # API routes
│   │   └── scannerRoutes.js
│   ├── utils/              # Scanning logic and utilities
│       ├── scanner.js
│       └── scoreCalculator.js
├── frontend/
│   ├── public/             # Static assets
│   ├── src/                # Frontend source code
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResultsCard.jsx
│   │   │   └── VulnerabilityItem.jsx
│   │   ├── pages/          # Pages
│   │   │   ├── Home.jsx
│   │   │   ├── QrScanner.jsx
│   │   │   └── ScannerDashboard.jsx
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Frontend entry point
│   │   ├── App.css         # Global styles
│   │   └── index.css       # Index styles
├── .gitignore              # Files to ignore in Git
└── README.md               # Project documentation
```

---

## How to Run the Project

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/hackathon11.git
cd hackathon11
```

### **2. Set Up the Backend**
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```bash
   touch .env
   ```
   Add the following environment variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/api-security-scanner
   PORT=5001
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### **3. Set Up the Frontend**
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### **4. Open the Application**
- Open your browser and go to:
  ```
  http://localhost:5173
  ```

---

## How It Works

1. **Enter API URL**: The user provides an API URL and selects the type of scan (e.g., authentication, rate limiting).
2. **Scan Process**:
   - The frontend sends the API URL to the backend.
   - The backend uses `scanner.js` to test the API for vulnerabilities.
   - Vulnerabilities are analyzed, and a security score is calculated.
3. **Results**:
   - The scan results, including vulnerabilities and the security score, are displayed on the frontend.

---

## Security Checks Performed

| Check              | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **Authentication** | Checks if the API requires authentication headers.                         |
| **Authorization**  | Tests if unauthorized users can access restricted data.                    |
| **Rate Limiting**  | Sends multiple requests to check if the API limits excessive requests.     |
| **Data Exposure**  | Analyzes API responses for sensitive data like passwords or tokens.        |
| **CORS**           | Tests if the API allows requests from untrusted origins.                   |

---

## Screenshots

### **Home Page**
![Home Page](https://zygomorphic-lavender-gpf3afykhg.edgeone.app/Screenshot%202026-03-13%20at%203.16.04%E2%80%AFPM.png)

### **Scan Results**
![Scan Results](https://required-blush-34gpy8kuh9.edgeone.app/Screenshot%202026-03-13%20at%203.48.46%E2%80%AFPM.png)

---

## Future Improvements

- Add support for OAuth2 token-based authentication testing.
- Implement more advanced SQL injection tests.
- Add support for scanning GraphQL APIs.
- Improve the UI with better visualizations for vulnerabilities.

---

## License

This project is licensed under the **MIT License**.

---

## Contributors

- **kiran jelugadekar** - [GitHub Profile](https://github.com/kiranjelugadekar)
- **krish shukla** - [GitHub Profile](https://github.com/shuklakrish51-glitch)
- **khetan patle** - [GitHub Profile](https://github.com/Khetanpatle22)
- **kshitij ingole** - [GitHub Profile](https://github.com/Kshitij-dotcom)


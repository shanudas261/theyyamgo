# TheyyamGo 🔴

**Discover the living tradition of Theyyam across North Kerala.**

TheyyamGo is a web application that helps users explore Theyyam performance locations, discover Kavus (sacred groves and temples), and find cultural events across North Kerala.

## ✨ Features

- 🗺️ **Interactive Map** — Explore Theyyam Kavus and their locations.
- 🔍 **Search and Filters** — Find locations using search, district, and date filters.
- 🎭 **Theyyam Information** — Learn about the history and cultural significance of Theyyam.
- 📅 **Event Submissions** — Submit Theyyam event information for review.
- 🔐 **Admin Dashboard** — Manage Kavu information and review event submissions.
- 📱 **Responsive UI** — Explore the application on desktop and mobile devices.
- 🌐 **Cultural Discovery** — Discover Theyyam traditions across North Kerala.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Leaflet

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)

## 📁 Project Structure

```text
theyyamgo/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

*The structure above is illustrative; adjust it to match the actual folders in your repository.*

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB installation
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd theyyamgo
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

Replace the example values with your actual configuration. Never commit your `.env` file or expose your database credentials.

Start the backend:

```bash
npm run dev
```

If your `package.json` does not define a `dev` script, use the start command configured in that file.

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory if your API configuration uses Vite environment variables:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## 🔑 Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `VITE_API_URL` | Backend API base URL used by the frontend |

Only use variables that your application actually reads. Frontend variables prefixed with `VITE_` are exposed to browser code, so never put secrets in them.

## 🌍 Deployment

The application can be deployed using separate services:

- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)

Before deploying, configure the production API URL, MongoDB connection, JWT secret, and backend CORS settings. Make sure the frontend calls the deployed backend rather than `localhost`.

## 🔮 Future Improvements

- Automatic location-based Kavu discovery
- Event approval workflows
- Performance dates and festival calendars
- Improved mobile map experience
- More detailed cultural information for each Kavu

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

## 📜 License

Add a license file if you intend to distribute this project under an open-source license.

---

**TheyyamGo — Discover the traditions, stories, and sacred places of North Kerala.**

# Nelo Test - Client Application

This is the client-side mobile application for the project, built with React Native and Expo. It provides the user interface and handles communication with the backend API.

## ✨ Features

- **Built with Expo:** Streamlines development, building, and deployment.
- **Component-Based UI:** Uses `react-native-paper` for a consistent and modern UI.
- **Context-based Authentication:** Global state for authentication is managed using React's Context API.
- **Environment-Aware:** Configuration for different environments (like the API URL) is managed with environment variables.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- Node.js (LTS version recommended)
- Yarn or npm (comes with Node.js)
- Expo CLI:
  ```sh
  npm install --global expo-cli
  ```
- Expo Go app on your physical iOS or Android device.

### Installation & Setup

1.  **Clone the repository**

2.  **Navigate to the client directory:**

    ```sh
    cd client
    ```

3.  **Install dependencies:**

    ```sh
    npm install
    ```

    or

    ```sh
    yarn install
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the root of the `client` directory. This file is git-ignored and should contain your local configuration.

    ```properties
    # .env
    API_BASE_URL=http://<YOUR_LOCAL_SERVER_IP>:3000/api
    NODE_ENV=development
    ```

    > **Note:** Replace `<YOUR_LOCAL_SERVER_IP>` with the local IP address of the machine running the backend server. The client app and server must be on the same network.

### Running the Application

1.  **Start the development server:**

    ```sh
    npm start
    ```

    or

    ```sh
    expo start
    ```

2.  **Open the app:**
    The command will start the Expo Metro Bundler and open a new tab in your web browser. You can then:
    - **On a physical device:** Scan the QR code shown in the terminal or the browser with the Expo Go app.
    - **On an emulator/simulator:** Press `a` to open in an Android emulator or `i` to open in an iOS simulator.

## 🔧 Tech Stack

- **Framework:** React Native with Expo
- **UI Library:** React Native Paper
- **Navigation:** React Navigation (inferred from `appNav.js`)
- **State Management:** React Context API (for `authContext.js`)

## 📁 Project Structure

The project follows a standard structure for React Native applications.

```
client/
├── src/
│   ├── context/       # Global state providers (e.g., authContext.js)
│   ├── navigation/    # Navigation stacks and configuration (e.g., appNav.js)
│   └── ...            # Other source directories (screens, components, etc.)
├── assets/            # Static assets like icons, splash screens, and fonts
├── App.js             # The main entry point component for the app
├── app.config.js      # Expo-specific configuration file
├── .env               # Local environment variables (not committed)
└── package.json       # Project dependencies and scripts
```

## Screenshots

Here are some screenshots of the application:

### Login

![Login](assets/login.png)

### New Post

![New Post](assets/newpost.png)

### Posts

![Posts](assets/posts.png)

### Register

![Register](assets/register.png)

# Nelo Test - Server Application

This is the backend server for the Nelo Test project, built with Node.js and Express. It provides a RESTful API for the client application to interact with, handling user authentication and data persistence with MongoDB.

## ✨ Features

- **RESTful API:** Built with Express.js for handling HTTP requests.
- **Database:** Uses MongoDB with Mongoose for object data modeling.
- **Authentication:** Implements JSON Web Token (JWT) based authentication using Passport.js.
- **Security:** Passwords are securely hashed using bcrypt.
- **Environment-based Configuration:** Manages configuration for different environments using `.env` files.
- **Logging:** Integrated logging with Winston for better debugging and monitoring.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v18.x or later recommended)
- npm or yarn
- MongoDB (or a MongoDB Atlas account)

## 🚀 Getting Started

Follow these instructions to get the backend server up and running on your local machine for development and testing.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd nelo_test/server
```

### 2. Install Dependencies

Install the required npm packages.

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the `/server` directory. This file is used to store sensitive information and configuration details. You can copy the example file:

```bash
cp .env.example .env
```

Then, open the `.env` file and fill in the required values:

```
# The port the server will run on
PORT=3000

# Your MongoDB connection string
MONGODB_URL=mongodb+srv://<user>:<password>@cluster-name.mongodb.net/your-db-name

# A secret key for signing JSON Web Tokens
ACCESS_TOKEN_SECRET=your-super-secret-key-for-jwt
```

> **Note:** The `.env` file is listed in `.gitignore` and should not be committed to version control.

### 4. Run the Application

**For development:**

This command uses `nodemon` to automatically restart the server when file changes are detected.

```bash
npm run dev
```

**For production:**

```bash
npm start
```

The server should now be running on `http://localhost:3000` (or the port you specified in `.env`).

## 🔧 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Passport.js (`passport-jwt`, `passport-local`)
- **Password Hashing:** bcrypt.js
- **Logging:** Winston
- **Environment Variables:** dotenv

## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/      # Request handling logic
│   ├── models/           # Mongoose models and schemas
│   ├── routes/           # API route definitions
│   └── utils/            # Utility functions (e.g., logger.js)
├── .env                  # Local environment variables (not committed)
├── db.js                 # Database connection logic
├── index.js              # Main application entry point
└── package.json          # Project dependencies and scripts
```

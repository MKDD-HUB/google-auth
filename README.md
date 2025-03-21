# Authentication System Setup Instructions

This guide will help you set up and run your custom authentication system with admin panel.

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

## Project Structure

Create the following directory structure for your project:

Here's how your project files should be organized:

```
authentication-system/
├── data/                  # Directory to store JSON data files
├── public/                # Static files served to the client
│   ├── index.html         # Main authentication page
│   ├── admin.html         # Admin dashboard page
│   ├── styles.css         # Styles for main page
│   ├── admin.css          # Styles for admin page
│   ├── script.js          # JavaScript for main page
│   └── admin.js           # JavaScript for admin page
├── .env                   # Environment variables
├── package.json           # Project dependencies
├── package-lock.json      # Dependency lock file
└── server.js              # Express server

## Setup Steps

1. **Create Project Directory**:
   ```bash
   mkdir authentication-system
   cd authentication-system
   ```

2. **Initialize Node.js Project**:
   ```bash
   npm init -y
   ```

3. **Install Dependencies**:
   ```bash
   npm install express body-parser bcrypt jsonwebtoken dotenv uuid
   npm install --save-dev nodemon
   ```

4. **Create Directory Structure**:
   ```bash
   mkdir public data
   ```

5. **Create Files**:
   Create all the files listed in the project structure above. Copy the content provided for each file.

6. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   JWT_SECRET=your_very_secure_jwt_secret_key_change_this_in_production
   ADMIN_PIN=123456
   ```
   
   > **Important**: Change the `JWT_SECRET` and `ADMIN_PIN` values to more secure ones in production.

7. **Move Static Files to Public Directory**:
   Ensure all HTML, CSS, and frontend JavaScript files are in the `public` directory.

## Running the Application

1. **Start the Server**:
   ```bash
   npm start
   ```
   
   For development with automatic restart:
   ```bash
   npm run dev
   ```

2. **Access the Application**:
   - Authentication Page: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin

## Authentication Flow

1. **User Registration**:
   - New users can sign up by clicking "Create account" on the login screen
   - Registration requires business email, username, and password
   - User data is stored securely with passwords hashed using bcrypt

2. **User Login**:
   - Users enter their email, then their password
   - The system validates credentials against stored data
   - Upon successful login, users are authenticated and redirected

3. **Admin Access**:
   - Access the admin dashboard at /admin
   - Enter the admin PIN defined in your .env file
   - Authenticated admins can view, edit, and delete user accounts

## Security Features

- Passwords are hashed using bcrypt (never stored in plain text)
- JWT (JSON Web Tokens) for secure admin authentication
- Admin PIN protection for administrative access
- Input validation for all user inputs
- Cross-site request forgery protection through token validation

## Customization

- **User Interface**: Modify the HTML and CSS files in the `public` directory to match your brand
- **Validation Rules**: Edit validation logic in the frontend (script.js) and backend (server.js)
- **Admin Capabilities**: Extend admin.js and server.js to add more administrative features

## Production Deployment Considerations

1. **Security Enhancements**:
   - Use HTTPS in production
   - Implement rate limiting
   - Set secure HTTP headers
   - Consider adding CAPTCHA for registration

2. **Database Migration**:
   - For larger applications, migrate from JSON files to a database like MongoDB or PostgreSQL

3. **Environment Configuration**:
   - Use different environment variables for development, staging, and production
   - Never commit .env files to version control

4. **Monitoring and Logging**:
   - Implement proper error logging and monitoring
   - Consider adding analytics for user behavior tracking

## Troubleshooting

- **Port Conflicts**: If port 3000 is already in use, change the PORT value in the .env file
- **Authentication Issues**: Check the JWT_SECRET in the .env file if admin authentication fails
- **Data Persistence**: Ensure the data directory has proper write permissions
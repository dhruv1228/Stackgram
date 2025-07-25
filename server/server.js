const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const app = express();

// Load environment variables
dotenv.config();

// In-memory database
const users = []; // Stores registered users

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD, // App password or actual email password
    },
});

// Verify the transporter setup
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter error:', error);
    } else {
        console.log('Email transporter is ready.');
    }
});

// CORS configuration to allow requests from localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000',  // Allow only requests from the React app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow these headers
    credentials: true,  // Allow cookies if necessary
};
app.use(cors(corsOptions));

app.use(express.json());

// Middleware to validate JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. Token not provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = user; // Attach user info to the request
        next();
    });
};

// Route: Register User
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ id: users.length + 1, name, email, password: hashedPassword });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Welcome to Stackgram!',
            html: `
                <h1>Welcome, ${name}!</h1>
                <p>Thank you for registering with Stackgram. We're excited to have you join our community.</p>
                <p>Feel free to explore our platform and let us know if you have any questions. We’re here to help!</p>
                <p>Thank you for joining us,</p>
                <p><strong>The Stackgram Team</strong></p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'User registered, but email could not be sent.' });
            } else {
                console.log('Email sent:', info.response);
                return res.status(201).json({ message: 'User registered successfully. Email sent.' });
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Error registering user.', error });
    }
});

// Route: Login User
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = users.find((u) => u.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
    } else {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
});

app.get('/api/dashboard', authenticateToken, (req, res) => {
    const user = users.find((u) => u.email === req.user.email);
    if (user) {
        return res.status(200).json({ name: user.name }); // Return the user's name
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
});

app.get('/api/search', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ message: 'Name query is required.' });
    }

    const matchedUsers = users.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase())
    );

    res.json({ users: matchedUsers });
});



// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const session = require('express-session');
const { connectDB, sequelize } = require('./config/db');
const AuthRouter = require('./routes/auth');
const cookieParser = require('cookie-parser');
const router = require('./routes/form');
const SeedAdmin = require('./seeders/AdminSeed');
const AdminRouter = require('./routes/AdminRouter');
const ManagerRouter = require('./routes/ManagerRoutes');
require('./models/index');
require('dotenv').config()


const app = express();


//middleware
app.use(express.json());
app.use(cookieParser())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

const PORT = process.env.PORT || 2001;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api/auth', AuthRouter)
app.use('/api/forms', router)
app.use('/api/admin', AdminRouter)
app.use('/api/manager', ManagerRouter)

const start = async () => {
    try {
        await connectDB();

        require('./models/User');
        await sequelize.sync({ force: false });

        console.log('Database synced successfully.');

        // await SeedAdmin();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error.message);
        process.exit(1);
    }
}

start();
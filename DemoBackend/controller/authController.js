const jwt = require('jsonwebtoken');
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

module.exports.register = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        if (!username || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isexistuser = await User.findOne({ where: { email: email, phone: phone } });
        if (isexistuser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, email, password: hashedPassword, phone });

        const response = {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
        };
        return res.status(201).json({ message: 'User created successfully', data: response });
    } catch (error) {
        console.error('Error in register:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports.loginSession = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isuser = await User.findOne({ where: { email } });
        if (!isuser) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, isuser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        req.session.user = {
            id: isuser.id,
            username: isuser.username,
            email: isuser.email,
            role: isuser.role,
            phone: isuser.phone
        };

        return res.status(200).json({ message: 'Login successful', data: req.session.user });

    } catch (error) {
        console.error('Error in loginSession:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error in logout:', err.message);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.error('Error in logout:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getMe = (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Not unauthenicated' });
        }
        return res.status(200).json({ message: 'User data', data: req.session.user });
    } catch (error) {
        console.error('Error in getMe:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.loginJwt = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'Login successful (JWT)',
            data: {
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            }
        });

    } catch (error) {
        console.error('Error in loginJwt:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.logoutJwt = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully (JWT)' });
    } catch (error) {
        console.error('Error in logoutJwt:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.getMeJwt = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User data', data: user });
    } catch (error) {
        console.error('Error in getMeJwt:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.editProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { username, mobile } = req.body;

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        if (username) {
            user.username = username;
        }

        if (mobile) {
            user.phone = mobile;
        }
        await user.save();
        return res.status(200).json({ message: 'Profile updated successfully', data: user });
    } catch (error) {
        console.log('error while editing profile', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports.profileImage = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' })
        }

        if (user.profileImage) {
            const oldImagePath = path.resolve(__dirname, '../uploads', user.profileImage);

            try {
                fs.unlinkSync(oldImagePath);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error('Error deleting old image:', err.message);
                }
            }
        }

        user.profileImage = req.file.filename;

        await user.save();
        return res.status(200).json({ message: 'Profile image updated successfully', data: user });
    } catch (error) {
        console.log('error while updating profile image', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

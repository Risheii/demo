require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const SeedAdmin = async () => {
    try {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const username = process.env.ADMIN_USERNAME;

        const isAdminSeeded = await User.findOne({ where: { email } });
        if (isAdminSeeded) return;

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin',
        });

        console.log('Admin seeded successfully');
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
}

module.exports = SeedAdmin;
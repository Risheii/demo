const { redisClient } = require("../config/redis");
const { User, FormSubmission, FormField } = require("../models");
const bcrypt = require("bcryptjs");

const CreateManager = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log(req.body, "from the create manager");

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isalready = await User.findOne({ where: { email } });

        if (isalready) {
            if (isalready.role === "user") {
                return res.status(400).json({ message: "This email is already used by a user" });
            } else if (isalready.role === "manager") {
                return res.status(400).json({ message: "Manager already exists" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username: name, email, password: hashedPassword, role });
        await redisClient.del('admin:users:all');
        console.log('🗑️ Users cache invalidated');

        return res.status(201).json({ message: "Manager created successfully", data: user });

    } catch (error) {
        console.log("Error creating manager", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const UpdateManager = async (req, res) => {
    try {
        const { id, name, email, password, role } = req.body;

        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "Manager not found" });
        }

        if (email != user.email) {
            const isalready = await User.findOne({ where: { email } });
            if (isalready) {
                return res.status(400).json({ message: "This email is already used by a user" });
            }
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        user.username = name;
        user.email = email;
        user.role = role;

        await user.save();
        await redisClient.del('admin:users:all');
        console.log('🗑️ Users cache invalidated');

        return res.status(200).json({ message: "Manager updated successfully", data: user });

    } catch (error) {
        console.log("Error updating manager", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const DeleteManager = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "Manager not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "You can not delete admin" });
        }
        if (user.role === "user") {
            return res.status(400).json({ message: "Manager not found" });
        }

        await user.destroy();
        await redisClient.del('admin:users:all');
        console.log('🗑️ Users cache invalidated');
        return res.status(200).json({ message: "Manager deleted successfully" });

    } catch (error) {
        console.log("Error deleting manager", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const GetAllManager = async (req, res) => {
    try {
        const users = await User.findAll({ where: { role: "Manager" } });
        return res.status(200).json({ message: "Managers fetched successfully", data: users });
    } catch (error) {
        console.log("Error fetching managers", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await FormSubmission.findAll({
            include: [{ model: FormField, as: 'fields' }],
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({ message: "All submissions", data: submissions });
    } catch (error) {
        console.log("Error fetching submissions", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { CreateManager, UpdateManager, DeleteManager, GetAllManager, getAllSubmissions };
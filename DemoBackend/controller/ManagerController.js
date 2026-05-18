const { User, FormField, FormSubmission } = require("../models");

const GetUsers = async (req, res) => {
    try {
        const users = await User.findAll({ where: { role: "user" } });
        return res.status(200).json({ message: "Users fetched successfully", data: users });
    } catch (error) {
        console.log("Error fetching users", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { GetUsers };
const { redisClient } = require("../config/redis");
const { User, FormField, FormSubmission } = require("../models");

const GetUsers = async (req, res) => {
    try {

        const cacheKey = 'admin:users:all';

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log('Cache HIT — serving users from Redis');
            return res.status(200).json({
                fromCache: true,
                data: JSON.parse(cached)
            });
        }

        console.log('Cache MISS — fetching from MySQL');
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        await redisClient.setEx(cacheKey, 300, JSON.stringify(users));
        console.log('📦 Users list cached in Redis');
        return res.status(200).json({ message: "Users fetched successfully", fromCache: false, data: users });
    } catch (error) {
        console.log("Error fetching users", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { GetUsers };
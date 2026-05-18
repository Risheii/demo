const isManager = (req, res, next) => {
    try {
        if (req.user.role === "manager" || req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
    } catch (error) {
        console.log("Error checking manager role", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = isManager;
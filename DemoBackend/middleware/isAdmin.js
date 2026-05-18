const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not unauthenicated" });
    }
    console.log(req.user.role, "from the is adminn middleware");
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
    }
    next();
}

module.exports = isAdmin;
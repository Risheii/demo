const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'user', 'manager'),
        defaultValue: 'user',
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true
});






module.exports = User;
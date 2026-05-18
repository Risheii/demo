const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FormSubmission = sequelize.define('FormSubmission', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    mobile: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // FK to users table — defined in associations below
    },
}, {
    tableName: 'form_submissions',
    timestamps: true,
});

module.exports = FormSubmission;
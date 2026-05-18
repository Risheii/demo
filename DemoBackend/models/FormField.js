const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FormField = sequelize.define('FormField', {
    submissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // FK to form_submissions
    },
    field_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    field_type: {
        type: DataTypes.ENUM('textbox', 'radio', 'checkbox'),
        allowNull: false,
    },
    // Store value as JSON string — handles both string and array
    // "India"  or  '["Surat","pune"]'
    field_value: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    // Store options as JSON string
    field_options: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'form_fields',
    timestamps: true,
});

module.exports = FormField;
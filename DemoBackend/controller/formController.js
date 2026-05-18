const { FormSubmission, FormField, User } = require('../models/index');

module.exports.createSubmission = async (req, res) => {
    try {
        const { name, email, mobile, fields } = req.body;
        const userId = req.user.id;
        const submission = await FormSubmission.create({ name, email, mobile, userId });
        
        if (fields && Array.isArray(fields)) {
            const fieldRows = fields.map(field => {
                const isArray = Array.isArray(field.value);
                return {
                    submissionId: submission.id,
                    field_name: field.name,
                    field_type: field.type,
                    field_value: isArray ? JSON.stringify(field.value) : field.value,
                    field_options: field.options ? JSON.stringify(field.options) : null,
                };
            });
            await FormField.bulkCreate(fieldRows);
        }

        const result = await FormSubmission.findOne({
            where: { id: submission.id },
            include: [{ model: FormField, as: 'fields' }],
        });

        return res.status(201).json({ message: 'Submission created', submission: result });
    } catch (error) {
        console.error('createSubmission error:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports.getAllSubmissions = async (req, res) => {
    try {
        const submissions = await FormSubmission.findAll({
            where: { userId: req.user.id },
            include: [{ model: FormField, as: 'fields' }],
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json(submissions);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports.getSubmissionById = async (req, res) => {
    try {
        const submission = await FormSubmission.findOne({
            where: { id: req.params.id, userId: req.user.id },
            include: [{ model: FormField, as: 'fields' }],
        });

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        return res.status(200).json(submission);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports.updateSubmission = async (req, res) => {
    try {
        const { name, email, mobile, fields } = req.body;

        const submission = await FormSubmission.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        await submission.update({ name, email, mobile });

        await FormField.destroy({ where: { submissionId: submission.id } });

        if (fields && Array.isArray(fields)) {
            const fieldRows = fields.map(field => {
                const isArray = Array.isArray(field.value);
                return {
                    submissionId: submission.id,
                    field_name: field.name,
                    field_type: field.type,
                    field_value: isArray ? JSON.stringify(field.value) : field.value,
                    field_options: field.options ? JSON.stringify(field.options) : null,
                };
            });
            await FormField.bulkCreate(fieldRows);
        }

        const updated = await FormSubmission.findOne({
            where: { id: submission.id },
            include: [{ model: FormField, as: 'fields' }],
        });

        return res.status(200).json({ message: 'Submission updated', submission: updated });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports.deleteSubmission = async (req, res) => {
    try {
        const submission = await FormSubmission.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        await FormField.destroy({ where: { submissionId: submission.id } });
        await submission.destroy();

        return res.status(200).json({ message: 'Submission deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
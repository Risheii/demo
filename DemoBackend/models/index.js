const User = require('./User');
const FormSubmission = require('./FormSubmission');
const FormField = require('./FormField');

// User → FormSubmission (one user has many submissions)
// Like: User.posts in MongoDB
User.hasMany(FormSubmission, { foreignKey: 'userId', as: 'submissions' });
FormSubmission.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// FormSubmission → FormField (one submission has many fields)
FormSubmission.hasMany(FormField, { foreignKey: 'submissionId', as: 'fields' });
FormField.belongsTo(FormSubmission, { foreignKey: 'submissionId', as: 'submission' });

module.exports = { User, FormSubmission, FormField };
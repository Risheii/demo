const { connectDB, sequelize } = require('./config/db');
require('./models/User');
const FormSubmission = require('./models/FormSubmission');
const FormField = require('./models/FormField');

const run = async () => {
    await connectDB();
    console.log("Dropping form_field_options if exists...");
    await sequelize.query('DROP TABLE IF EXISTS `form_field_options`;');
    console.log("Syncing FormSubmission with force: true to recreate it...");
    await FormSubmission.sync({ force: true });
    console.log("FormSubmission recreated successfully.");
    console.log("Syncing FormField with force: true to recreate it...");
    await FormField.sync({ force: true });
    console.log("FormField recreated successfully.");
    process.exit(0);
};
run();

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config');
const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes');
const cron = require('node-cron');
const { ReportedProblem, PendingProblem } = require('./models/problem');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(require('cors')());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes); // User routes (register and login)
app.use('/api/problems', problemRoutes); // Problem management routes

// Scheduled Task to Move Problems to Pending
cron.schedule('0 0 * * *', async () => { // Runs daily at midnight
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    try {
        // Find problems older than 2 days
        const problemsToMove = await ReportedProblem.find({ dateReported: { $lte: twoDaysAgo } });

        for (const problem of problemsToMove) {
            // Create a new entry in PendingProblems collection
            const pendingProblem = new PendingProblem({
                username: problem.username,
                problemDescription: problem.problemDescription,
                dateReported: problem.dateReported,
            });

            await pendingProblem.save(); // Save to PendingProblems
            await ReportedProblem.findByIdAndDelete(problem._id); // Remove from ReportedProblems
        }

        console.log("Moved old problems to Pending collection.");
    } catch (error) {
        console.error("Error moving problems to Pending collection:", error);
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

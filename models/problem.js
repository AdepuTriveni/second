const mongoose = require('mongoose');

// Reported Problems Schema
const ReportedProblemSchema = new mongoose.Schema({
    username: { type: String, required: true },
    problemDescription: { type: String, required: true },
    dateReported: { type: Date, default: Date.now },
});

// Pending Problems Schema
const PendingProblemSchema = new mongoose.Schema({
    username: { type: String, required: true },
    problemDescription: { type: String, required: true },
    dateReported: { type: Date, required: true },
    dateMovedToPending: { type: Date, default: Date.now },
});

// Resolved Problems Schema
const ResolvedProblemSchema = new mongoose.Schema({
    username: { type: String, required: true },
    problemDescription: { type: String, required: true },
    dateReported: { type: Date, required: true },
    dateResolved: { type: Date, default: Date.now },
});

// Avoid overwriting models
const ReportedProblem = mongoose.models.ReportedProblem || mongoose.model('ReportedProblem', ReportedProblemSchema);
const PendingProblem = mongoose.models.PendingProblem || mongoose.model('PendingProblem', PendingProblemSchema);
const ResolvedProblem = mongoose.models.ResolvedProblem || mongoose.model('ResolvedProblem', ResolvedProblemSchema);

module.exports = { ReportedProblem, PendingProblem, ResolvedProblem };

const express = require('express');
const multer = require('multer');
const { ReportedProblem, PendingProblem, ResolvedProblem } = require('../models/problem');
const router = express.Router();

// Error handler utility
const errorHandler = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ success: false, error: message });
};

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Report a Problem
router.post('/api/problems/report', upload.single('image'), async (req, res) => {
    const { problemDescription, location } = req.body;

    // You can uncomment this validation if needed:
    /*
    if (!problemDescription || !location) {
        return res.status(400).json({
            success: false,
            error: 'Problem description and location are required',
        });
    }
    */

    try {
        const problem = new ReportedProblem({
            problemDescription,
            location,
            imagePath: req.file ? req.file.path : null,
            dateReported: new Date(),
        });

        await problem.save();

        res.status(201).json({
            success: true,
            message: 'Problem reported successfully',
            data: problem,
        });
    } catch (error) {
        errorHandler(res, error, 'Error reporting problem');
    }
});

// Fetch Reported Problems (with pagination)
router.get('/reported', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const problems = await ReportedProblem.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await ReportedProblem.countDocuments();

        res.status(200).json({
            success: true,
            data: problems,
            meta: { page, limit, total },
        });
    } catch (error) {
        errorHandler(res, error, 'Error fetching reported problems');
    }
});

// Fetch Pending Problems (with pagination)
router.get('/pending', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const problems = await PendingProblem.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await PendingProblem.countDocuments();

        res.status(200).json({
            success: true,
            data: problems,
            meta: { page, limit, total },
        });
    } catch (error) {
        errorHandler(res, error, 'Error fetching pending problems');
    }
});

// Fetch Resolved Problems (with pagination)
router.get('/resolved', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const problems = await ResolvedProblem.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await ResolvedProblem.countDocuments();

        res.status(200).json({
            success: true,
            data: problems,
            meta: { page, limit, total },
        });
    } catch (error) {
        errorHandler(res, error, 'Error fetching resolved problems');
    }
});

// Move a Pending Problem to Resolved
router.post('/pending/mark-resolved/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const problem = await PendingProblem.findById(id);
        if (!problem) {
            return res.status(404).json({
                success: false,
                error: 'Problem not found',
            });
        }

        const resolvedProblem = new ResolvedProblem({
            username: problem.username,
            problemDescription: problem.problemDescription,
            location: problem.location,
            dateReported: problem.dateReported,
            dateResolved: new Date(),
        });

        await resolvedProblem.save();
        await PendingProblem.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Problem marked as resolved',
            data: resolvedProblem,
        });
    } catch (error) {
        errorHandler(res, error, 'Error marking problem as resolved');
    }
});

module.exports = router;
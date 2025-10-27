import express from 'express';

const router = express.Router();

// Minimal admin routes stub — populate with admin endpoints as needed.
router.get('/', (_req, res) => {
  res.status(200).json({ message: 'Admin routes placeholder' });
});

export default router;

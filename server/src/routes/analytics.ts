import express from 'express';

const router = express.Router();

// Minimal analytics routes stub — extend with actual analytics endpoints.
router.get('/', (_req, res) => {
  res.status(200).json({ message: 'Analytics routes placeholder' });
});

export default router;

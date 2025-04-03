import express from 'express';
import { upload } from '../middleware/multer.js'; // Multer setup
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // Cloudinary upload logic
import fs from 'fs/promises'; // File system promises
import path from 'path'; // Path module to handle paths

const router = express.Router();

router.post('/image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryResponse) {
      return res.status(500).json({ error: 'Cloudinary upload failed' });
    }

    // Construct full file path using path.resolve() for compatibility
    const filePath = path.resolve(req.file.path);

    // Check if file exists before attempting to delete it
    try {
      await fs.access(filePath); // Check if the file exists
      await fs.unlink(filePath); // Delete file after confirming it's uploaded
    } catch (fileError) {
      // Handling case when the file is not accessible or already deleted
    }

    // Respond with the Cloudinary URL
    res.json({ imageUrl: cloudinaryResponse.secure_url });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

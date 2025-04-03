import express from 'express';
import { upload } from '../middleware/multer.js'; // Import Multer setup
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // Import Cloudinary function
import fs from 'fs/promises';

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

    // Send Cloudinary URL as response
    res.json({ imageUrl: cloudinaryResponse.secure_url });

    // Delete file from local storage
    await fs.unlink(req.file.path);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

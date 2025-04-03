import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

       
        

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });

        

        // Check if the file exists before attempting to delete it
        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath); // Delete local file after upload
                
            } catch (err) {
                console.error('Error deleting local file:', err);
            }
        } else {
            console.log('File not found, cannot delete:', localFilePath);
        }

        return response;

    } catch (error) {
        // Debugging: Log the error for more clarity
        
        
        // Ensure the local file is deleted if something goes wrong
        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
                console.log('Error occurred, local file deleted:', localFilePath);
            } catch (err) {
                console.error('Error deleting local file during failure:', err);
            }
        }
        
        return null;
    }
};

export { uploadOnCloudinary };

import multer from 'multer';

// Configure multer storage with destination and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Debugging: Log the destination folder to check where the file is being stored
        
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        // Debugging: Log the file name to ensure it is being processed correctly
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname); // You can choose to rename the file if needed, e.g., using the unique suffix
    }
});

// Debugging: Log Multer setup to verify configuration


export const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB (you can adjust this limit)
    fileFilter: (req, file, cb) => {
        // Debugging: Log the file type to ensure proper filtering
        
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only image files are allowed!'), false); // Reject non-image files
        }
    }
});

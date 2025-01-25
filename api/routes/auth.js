import express from "express"
const router = express.Router();
// exports.router = router;
import multer from 'multer'
import path from 'path'
import { registerUser, loginUser, logout } from '../controllers/authController.js';


router.post('/register', registerUser);

// Login
router.post('/login', loginUser);
// Logout
router.post('/logout', logout);

// Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: './uploads/profiles',
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5000000 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     if (extname && mimetype) {
//       return cb(null, true);
//     }
//     cb(new Error('Invalid image format!'));
//   }
// });
// exports.upload = upload;



// Update user profile
// router.put('/profile', authMiddleware, upload.single('profileImage'), updateProfile);

export default router
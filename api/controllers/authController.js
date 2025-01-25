import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { router, upload } from '../routes.js/auth.js';
import connection from "../db.js"
import cookieParser from 'cookie-parser';



export const registerUser = async (req, res) => {
  try {
    const { username, email, password, level } = req.body;
    
    // Check if user exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user
    const query = `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)`;
    const [result] = await connection.execute(query, [
      username,
      email,
      hashedPassword,
      // level
      // req.file?.filename || null
    ]);
    
    // Generate token
    // const token = jwt.sign(
    //   { userId: result.insertId, username },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '24h' }
    // );
    
    res.status(201).json("User created successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const loginUser = async (req, res) => {
    try {
      // const { email, password } = req.body;
      
      // Get user
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [req.body.email]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      const user = users[0];
      
      // Check password
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate token
      const token = jwt.sign({ id: user.id },"jwtkey");
      const { password, ...other } = user;
      res.cookie("access_token",token, {
        httpOnly:true
      }).status(200)
      .json(other)
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

export const logout = (req, res) =>{

  res.clearCookie("access_token",{
    sameSite:"none",
    secure: true
  }).status(200).json("user has been logged out")
};

// export const updateProfile = async (req, res) => {
//     try {
//       const { username, email, level, bio } = req.body;
//       const userId = req.user.userId;
      
//       let query = `
//         UPDATE users
//         SET username = ?, email = ?, level = ?, bio = ?
//       `;
//       let params = [username, email, level, bio];
      
//       if (req.file) {
//         query += `, profile_image = ?`;
//         params.push(req.file.filename);
//       }
      
//       query += ` WHERE id = ?`;
//       params.push(userId);
      
//       await connection.execute(query, params);
//       res.json({ message: 'Profile updated successfully' });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
// }
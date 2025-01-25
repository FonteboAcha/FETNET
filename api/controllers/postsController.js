import connection from "../db.js" 
 
 
//  export const createPost = async (req, res) => {
//   try {
//     const { title, content, userId, visibility, effectiveGroupId }= req.body;

//     const groupId = effectiveGroupId === undefined ? null : effectiveGroupId;
//     const query = `
//       INSERT INTO posts (title, content, user_id, visibility, group_id)
//       VALUES (?, ?, ?, ?, ?)`;
//     const [result] = await connection.execute(query, [
//       title, content, userId, visibility, groupId
//     ]);
//     res.status(201).json({ id: result.insertId });
//     console.log(result.insertId)
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }
export const createPost = async (req, res) => {
  try {
    // console.log(req.body)
    const { title, content, userId, visibility, effectiveGroupId } = req.body;

    const groupId = effectiveGroupId === undefined ? null : effectiveGroupId; 

    const query = `
      INSERT INTO posts (title, content, user_id, visibility, group_id)
      VALUES (?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [
      title, content, userId, visibility, groupId 
    ]);
    res.status(201).json({ id: result.insertId });
    console.log(result.insertId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
//   console.log('Connection object:', connection); // Check if connection object is valid
// const connectionStatus = await connection.execute('SELECT 1'); // Test connection
// console.log('Connection test:', connectionStatus)

        try {
          const { userId, groupId } = req.query;

          console.log(req.query);

          // let query = `SELECT * from posts`

          let query = `
            SELECT p.*,u.username, g.name as group_name,
              COUNT(DISTINCT l.id) as likes_count,
              COUNT(DISTINCT c.id) as comments_count
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN groups g ON p.group_id = g.id
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE (p.visibility = 'general')
          `;
          
          if (userId) {
            query += ` OR (p.visibility = 'specific' AND EXISTS (
              SELECT 1 FROM user_groups ug
              WHERE ug.user_id = ? AND ug.group_id = p.group_id
            ))`;
          }
          
          query += `
            GROUP BY p.id
            ORDER BY p.created_at DESC
          `;
          
          const [posts] = await connection.execute(query, userId ? [userId] : []);
          res.json(posts);
        } catch (error) {
          res.status(500).json({ message: error.message });
          console.log(error.message)
        }
      
}

export const likeUnlikePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;
      
      // Check if like exists
      const [existing] = await connection.execute(
        'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
      );
      
      if (existing.length > 0) {
        await connection.execute(
          'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
          [userId, postId]
        );
        res.json({ liked: false });
      } else {
        await connection.execute(
          'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
          [userId, postId]
        );
        res.json({ liked: true });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

export const addComment = async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, userId } = req.body;
      const query = `
        INSERT INTO comments (content, user_id, post_id)
        VALUES (?, ?, ?)
      `;
      const [result] = await connection.execute(query, [content, userId, postId]);
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export const viewComments = async (req, res) => {
    try {
      const { postId } = req.params;
      const query = `
        SELECT c.*, u.username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
      `;
      const [comments] = await connection.execute(query, [postId]);
      res.json(comments);
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
  }
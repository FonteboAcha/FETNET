import connection from "../db.js" 

export const getGroups = async (req, res) => {
    try {
        const [groups] = await connection.execute(
            'SELECT * FROM groups'
        );
        res.json(groups);
    }catch(error){
        console.log("Error getting groups")
        res.status(500).json({message: error.message})
    }
}
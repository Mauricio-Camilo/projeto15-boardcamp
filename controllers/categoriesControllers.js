import connection from "./../database.js"

export async function getCategories (req, res) {
    try {
        const query = await connection.query(`SELECT * FROM categories`);
        res.send(query.rows);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir as categorias");
    }
}

export async function postCategories (req, res) {
    const { name } = req.body;
    if (name === "") return res.sendStatus(400);
    try {
        const category = await connection.query(
            `SELECT * FROM categories WHERE name=$1`, [name]);
        if (category.rows.length !== 0) return res.sendStatus(409);
        const query = await connection.query(
            `INSERT INTO categories (name) 
            VALUES ($1)`,
            [name]);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir uma categoria");
    }
}


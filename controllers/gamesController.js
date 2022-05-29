import connection from "./../database.js";

export async function getGames(req, res) {
    const nome = req.query.name;
    try {
        if (nome !== undefined) {
            // README: DEPOIS APLICAR SQL INJECTION NO LIKE
            const query = await connection.query(`SELECT * FROM games WHERE name LIKE '${nome}%'`);
            res.send(query.rows);
        }
        else {
            const query = await connection.query(`SELECT * FROM games`);
            res.send(query.rows);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir as categorias");
    }
}

export async function postGames(req, res) {

    // TIRAR A PARTIR DAQUI POR CONTA DO MIDDLEWARE
    // MANRTER O REQ.BODY
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    if (name === "" || stockTotal < 0 || pricePerDay < 0) return res.sendStatus(400);

    try {
        // VALIDAÇÃO DE GAME EXISTENTE, COLOCAR DEPOIS EM UM MIDDLEWARE
        const game = await connection.query(
            `SELECT * FROM games WHERE name=$1`, [name]);
        if (game.rows.length !== 0) return res.sendStatus(409);
        // VALIDAÇÃO DE ID INEXISTENTE, COLOCAR DEPOIS EM UM MIDDLEWARE
        const id = await connection.query(
            `SELECT * FROM categories WHERE id=$1`, [categoryId]);
        if (id.rows.length === 0) return res.send("Id inexistente").status(409);

    // FINALIZAR AQUI POR CONTA DO MIDDLEWARE

        const query = await connection.query(
            `INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1,$2,$3,$4,$5)`,
            [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir um jogo");
    }
}

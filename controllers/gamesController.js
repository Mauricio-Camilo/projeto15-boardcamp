import connection from "./../database.js";

export async function getGames(req, res) {
    // FALTOU PEGAR O NOME DA CATEGORIA E MANDAR NO GET;
    // USAR O JOIN PRA PEGAR ESSA INFORMAÇÃO

    // ESTUDAR LIVE CODING, USO DE PARAMS E WHERECLAUSES
    const nome = req.query.name;
    try {
        if (nome !== undefined) {
            const query = await connection.query(`SELECT * FROM games WHERE name LIKE '${nome}%'`);
            res.send(query.rows);   // USAR ILIKE, PRA NÃO CONSIDERAR MAIUSCULO/MINUSCULO
        }
        else {
            const query = await connection.query(`SELECT * FROM games`);
            res.send(query.rows);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir os jogos");
    }
}

export async function postGames(req, res) {

    // FALTOU VALIDAÇÃO DO JOI

    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
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

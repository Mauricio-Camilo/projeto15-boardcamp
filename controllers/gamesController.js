import connection from "./../database.js";

export async function getGames(req, res) {
    
    const {name} = req.query;

    // Essa variável vai determinar o que será preenchido no meu select
    let whereClause = "";

    // Aqui são os parametros que serão inseridos na query de forma dinâmica
    const params = [];

    if (name) {
        params.push(`${name}%`) // Aqui é um parâmetro do tipo LIKE, que começa com as letras de name
        whereClause = `WHERE g.name ILIKE $${params.length}`;
    }
    /* O ILIKE funciona como case insensitive. O where clause só é preenchido se é passado o req.query;
    A quantidade de parâmetros corresponde a quantidade de queries passadas, por isso é dinãmico*/

    try {
            const query = await connection.query(`
            SELECT g.*, c.name as "categoryName" FROM games g
            JOIN categories c ON g."categoryId" = c.id
            ${whereClause}
            `, params);
            res.send(query.rows);
        
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

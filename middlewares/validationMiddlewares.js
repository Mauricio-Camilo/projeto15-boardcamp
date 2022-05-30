import connection from "../database.js";

export async function gamesValidation(req, res, next) {
    const { name, stockTotal, categoryId, pricePerDay } = req.body;
    if (name === "" || stockTotal < 0 || pricePerDay < 0) return res.sendStatus(400);

    try {
        const game = await connection.query(
            `SELECT * FROM games WHERE name=$1`, [name]);
        if (game.rows.length !== 0) return res.sendStatus(409);
        const id = await connection.query(
            `SELECT * FROM categories WHERE id=$1`, [categoryId]);
        if (id.rows.length === 0) return res.sendStatus(400);

        next();
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir um jogo");
    }
}

export function customersValidation(req, res, next) {
    const { name, phone, cpf, birthday } = req.body;

    const birthdayRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}/
    if (!birthdayRegex.test(birthday)) return res.sendStatus(400);

    if (name === "" || cpf.length !== 11
        || phone.length < 9 || phone.length > 12) return res.sendStatus(400);

    next();
}

export async function cpfValidation (req, res, next) {
    const {cpf} = req.body;
    try {
        const cpfclient = await connection.query(
            `SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if (cpfclient.rows.length !== 0) return res.sendStatus(409);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir um cliente");
    }
    next();
}



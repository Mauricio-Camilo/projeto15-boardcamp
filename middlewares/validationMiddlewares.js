
export default async function gamesValidation(req, res, next) {
    const { name, stockTotal, categoryId, pricePerDay } = req.body;
    if (name === "" || stockTotal < 0 || pricePerDay < 0) return res.sendStatus(400);

    try {
        // VALIDAÇÃO DE GAME EXISTENTE
        const game = await connection.query(
            `SELECT * FROM games WHERE name=$1`, [name]);
        if (game.rows.length !== 0) return res.sendStatus(409);
        // VALIDAÇÃO DE ID INEXISTENTE
        const id = await connection.query(
            `SELECT * FROM categories WHERE id=$1`, [categoryId]);
        if (id.rows.length === 0) return res.sendStatus(409);

        next();
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir um jogo");
    }
}

// export default function customersValidation(req, res, next) {

//     const { name, phone, cpf, birthday } = req.body;

//     // VALIDAÇÃO DE DATA DE NASCIMENTO, COLOCAR DEPOIS EM UM MIDDLEWARE
//     const birthdayRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}/
//     if (!birthdayRegex.test(birthday)) return res.sendStatus(400);

//     // VALIDAÇÃO DE NOME, CPF E PHONE, COLOCAR DEPOIS EM UM MIDDLEWARE
//     if (name === "" || cpf.length !== 11
//         || phone.length < 9 || phone.length > 12) return res.sendStatus(400);

//     next();
// }


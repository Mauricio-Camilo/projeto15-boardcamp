import connection from "../database.js";
import dayjs from "dayjs";

export async function getRentals (req, res) {
    try {
        const allRents = [];
        const query = await connection.query(`SELECT * FROM rentals`);

        for (let i = 0; i < query.rows.length; i++) {
            const { id, customerId, gameId, rentDate,
                daysRented, returnDate, originalPrice, delayFee } = query.rows[i];

            const idGame = await connection.query(
                `SELECT * FROM games WHERE id=$1`, [query.rows[0].gameId]);
            const game = idGame.rows[0];

            const categoryName = await connection.query(
                `SELECT * FROM categories WHERE id=$1`, [game.categoryId]);
            const category = categoryName.rows[0];

            const idUser = await connection.query(
                `SELECT * FROM customers WHERE id=$1`, [query.rows[0].customerId]);
            const customer = idUser.rows[0];

            let rentData = {
                id,
                customerId,
                gameId,
                rentDate,
                daysRented,
                returnDate,
                originalPrice,
                delayFee,
                customer: {
                    id: customer.id,
                    name: customer.name
                },
                game: {
                    id: game.id,
                    name: game.name,
                    categoryId: game.categoryId,
                    categoryName: category.name
                }
            };
            allRents.push(rentData);
        }
        res.send(allRents);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir as categorias");
    }
}

export async function postRentals (req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');
    const returnDate = null;
    const delayFee = null;

    try {
        if (daysRented < 0) return res.sendStatus(400);

        const idgame = await connection.query(
            `SELECT * FROM games WHERE id=$1`, [gameId]);
        if (idgame.rows.length === 0) return res.sendStatus(400);

        const originalPrice = idgame.rows[0].pricePerDay * daysRented;

        const iduser = await connection.query(
            `SELECT * FROM customers WHERE id=$1`, [customerId]);
        if (iduser.rows.length === 0) return res.sendStatus(400);

        const query = await connection.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented",
             "returnDate","originalPrice","delayFee") 
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [customerId, gameId, rentDate, daysRented, returnDate,
                originalPrice, delayFee]);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir um aluguel");
    }
}

export async function updateRentals (req, res) {
    const { id } = req.params;
    const returnDate = dayjs().format('YYYY-MM-DD');

    try {
        const idRental = await connection.query(
            `SELECT * FROM rentals WHERE id=$1`, [id]);
        if (idRental.rows.length === 0) return res.sendStatus(404);
        if (idRental.rows[0].returnDate !== null) return res.sendStatus(400);

        const query = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        const { rentDate, daysRented, originalPrice } = query.rows[0];
        const dateStart = rentDate.toISOString().slice(0, 10);
        const delayFee = 0;

        // FALTOU CONVERTER PARA DIAS

        let dif = new Date(returnDate).getTime() - new Date(dateStart).getTime();
        if (dif > daysRented) delayFee = (dif - daysRented) * originalPrice;

        await connection.query(`
        UPDATE rentals
        SET 
        "returnDate" = $1,
        "delayFee" = $2
        WHERE id=$3`, [returnDate, delayFee, id]);
        res.sendStatus(200);
    }

    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao finalizar um aluguel");
    }
}

export async function deleteRentals (req, res) {
    const { id } = req.params;
    try {
        const idRental = await connection.query(
            `SELECT * FROM rentals WHERE id=$1`, [id]);
        if (idRental.rows.length === 0) return res.sendStatus(404);
        if (idRental.rows[0].returnDate === null) return res.sendStatus(400);

        await connection.query(`DELETE FROM rentals WHERE id=$1`, [id]);
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao deletar um aluguel");
    }
}


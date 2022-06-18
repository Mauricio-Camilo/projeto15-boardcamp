import connection from "../database.js";
import dayjs from "dayjs";

export async function getRentals (req, res) {

    /* Nesse caso, a query carrega dois parâmetros opcionais, então cada parâmetro carrega uma condição
    Como teremos mais de uma condição, um array auxiliar chamado conditions vai pegar esses parâmetros,
    por meio da função join, ela vai conseguir unir as duas condições no whereClauses*/ 

    const {customerId, gameId} = req.query;

    let whereClauses = "";
    const params = [];
    const conditions = [];

    if (customerId) {
        params.push(customerId);
        conditions.push(`rentals."customerId" = $${params.length}`);
    }

    if (gameId) {
        params.push(gameId);
        conditions.push(`rentals."gameId" = $${params.length}`);
    }

    if (params.length > 0) {
        whereClauses = `WHERE ${conditions.join(" AND ")}`
    }

    try {
        const allRents = [];

        /* Nessa query foi criada um objeto com text e rowMode, para funcionar a iteração.
        Poderia fazer um map direto no res.send, mas o código não fica legível.
        Usando essa abordagem, é possível fazer a iteração do result*/

        const result = await connection.query({text:`
        SELECT r.*, c.name AS customer, g.name AS game, ca.id AS "categoryId", ca.name AS "category" FROM rentals r
        JOIN customers c ON r."customerId" = c.id
        JOIN games g ON r."gameId" = g.id
        JOIN categories ca ON g."categoryId" = ca.id
        ${whereClauses}
        `, rowMode: "array"}, params);

        res.send(result.rows.map(mapRentalArrays));

        function mapRentalArrays(row) {
            const [id, customerId, gameId, rentDate, daysRented,
                returnDate, originalPrice, delayFee, customer,
            game, categoryId, category] = row;
            return {
                id,
                customerId,
                gameId,
                rentDate,
                daysRented,
                returnDate,
                originalPrice,
                delayFee,
                customer: {
                    id: customerId,
                    name: customer
                },
                game: {
                    id: gameId,
                    name: game,
                    categoryId,
                    categoryName: category.name
                }
            }
        }

  

        
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
        let dateStart = rentDate.toISOString().slice(0, 10);
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


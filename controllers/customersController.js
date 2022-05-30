import connection from "./../database.js"

export async function getCustomers (req, res) {
    const cpf = req.query.cpf;
    try {
        if (cpf !== undefined) {
            const query = await connection.query(`SELECT * FROM customers WHERE cpf LIKE '${cpf}%'`);
            res.send(query.rows);
        }
        else {
            const query = await connection.query(`SELECT * FROM customers`);
            res.send(query.rows);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir os clientes");
    }
}

export async function getIdCustomers (req, res) {
    const { id } = req.params;
    try {
        const clienteId = await connection.query(`SELECT * FROM customers WHERE id=$1`, [id]);
        if (clienteId.rows.length === 0) return res.sendStatus(404);
        else return res.send(clienteId.rows);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir um cliente");
    }
}

export async function postCustomers (req, res) {
    const { name, phone, cpf, birthday} = req.body;
    try {
        const query = await connection.query(
            `INSERT INTO customers ("name", "phone", "cpf", "birthday") 
            VALUES ($1,$2,$3,$4)`,
            [name, phone, cpf, birthday]);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir um cliente");
    }
}

export async function updateCustomers (req, res) {
    const { id } = req.params;
    const {name, phone, cpf, birthday} = req.body;

    try {
        await connection.query(`
        UPDATE customers
        SET 
        name = $1,
        phone = $2,
        cpf = $3,
        birthday = $4
        WHERE id=$5`, [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao atualizar dadod do cliente");
    }
}


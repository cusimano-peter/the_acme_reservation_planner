const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL);

const createTables = async () => {
    await client.connect();
    await client.query(`
        DROP TABLE IF EXISTS reservations;
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS restaurants;

        CREATE TABLE customers (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE restaurants (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE reservations (
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant_id UUID REFERENCES restaurants(id),
            customer_id UUID REFERENCES customers(id)
        );
    `);
};

const createCustomer = async (name) => {
    const res = await client.query('INSERT INTO customers (id, name) VALUES (gen_random_uuid(), $1) RETURNING *', [name]);
    return res.rows[0];
};

const createRestaurant = async (name) => {
    const res = await client.query('INSERT INTO restaurants (id, name) VALUES (gen_random_uuid(), $1) RETURNING *', [name]);
    return res.rows[0];
};

const fetchCustomers = async () => {
    const res = await client.query('SELECT * FROM customers');
    return res.rows;
};

const fetchRestaurants = async () => {
    const res = await client.query('SELECT * FROM restaurants');
    return res.rows;
};

const createReservation = async (date, party_count, restaurant_id, customer_id) => {
    const res = await client.query('INSERT INTO reservations (id, date, party_count, restaurant_id, customer_id) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING *', [date, party_count, restaurant_id, customer_id]);
    return res.rows[0];
};

const destroyReservation = async (id) => {
    await client.query('DELETE FROM reservations WHERE id = $1', [id]);
};

module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    destroyReservation,
};

const express = require('express');
const app = express();
const { createTables, createCustomer, createRestaurant, fetchCustomers, fetchRestaurants, createReservation, destroyReservation } = require('./db');

app.use(express.json());

app.get('/api/customers', async (req, res) => {
    const customers = await fetchCustomers();
    res.json(customers);
});

app.get('/api/restaurants', async (req, res) => {
    const restaurants = await fetchRestaurants();
    res.json(restaurants);
});

app.post('/api/customers/:id/reservations', async (req, res) => {
    const { date, party_count, restaurant_id } = req.body;
    const { id: customer_id } = req.params;
    const reservation = await createReservation(date, party_count, restaurant_id, customer_id);
    res.status(201).json(reservation);
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
    const { id } = req.params;
    await destroyReservation(id);
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;

const init = async () => {
    await createTables(); // Ensure tables are set up
    app.listen(port, () => console.log(`Server listening on port ${port}`));
};

init();

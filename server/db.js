const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_Reservation_Planner_db');
const  uuid = require('uuid');


const createTables = async()=> {
    const SQL = `
    DROP TABLE IF EXISTS customer;
    DROP TABLE IF EXISTS restaurant;
    DROP TABLE IF EXISTS reservation;
    CREATE TABLE customer(
        id UUID PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
    );
    CREATE TABLE restaurant(
        id UUID PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
    );
    CREATE TABLE reservation(
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurant table NOT NULL
        customer_id UUID REFERENCES customer table NOT NULL
    );
    `;
    await client.query(SQL);
};


const createCustomer = async({name})=> {
    const SQL = `
    INSERT INTO customer(id, name) VALUE($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};


const createRestaurant = async({name})=> {
    const SQL = `
    INSERT INTO restaurant(id, name) VALUE($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};


const fetchCustomer = async()=> {
    const SQL = `
    SELECT *
    FROM customer
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchRestaurant = async()=> {
    const SQL = `
    SELECT *
    FROM restaurant
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const createReservation = async({ restaurant_id, customer_id, date, party_count})=> {
    const SQL = `
    INSERT INTO reservation(id, restaurant_id, customer_id, date, party_count)
    VALUE($1, $2, $3, $4, $5)
    RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), restaurant_id, customer_id, date, party_count]);
    return response.rows[0];
};

const fetchReservation = async()=> {
    const SQL = `
    SELECT * 
    FROM reservation
    `;
    const response = await client.query(SQL);
    return response.rows;
};


const destroyReservation = async({id, customer_id}) => {
    console.log(id, customer_id)
    const SQL = `
    DELETE FROM reservation
    WHERE id = $1 AND customer_id=$2
    `;
    await client.query(SQL, [id, user_id]);
};

module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    createReservation,
    fetchCustomer,
    fetchRestaurant,
    fetchReservation,
    destroyReservation
};
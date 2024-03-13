const { createCipheriv } = require('crypto');
const { client } = require('./db');
const { createReadStream } = require('fs');


app.get('/api/customer', async(req, res, next)=> {
    try{
        res.send(await fetchCustomer());
    }
    catch(error){
        next(error);
    }
});

app.get('/api/restaurant', async(req, res, next)=> {
    try{
        res.send(await fetchRestaurant());
    }
    catch(error){
        next(error);
    }
});

app.get('/api/reservation', async(req, res, next)=> {
    try{
        res.send(await fetchReservation());
    }
    catch(error){
        next(error)
    }
});

app.delete('/api/customer/:customer_id/reservation/:id', async(req, res, next)=> {
    try{
        await destroyReservation({customer_id: req.params.customer_id, id: req.params.id});
        res.sendStatus(204);
    }
    catch(error){
        next(error);
    }
});


const init = async()=> {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('created tables');
    const [Jewel, Tati, Matt, Joy, BryceCanyon, Zion, Ushuia, Glaciers] = await Promise.all([
        createCustomer({ name: 'Jewel'}),
        createCustomer({ name: 'Tati'}),
        createCustomer({ name: 'Matt'}),
        createCustomer({ name: 'Joy'}),
        createRestaurant({name: 'BryceCanyon'}),
        createRestaurant({ name: 'Zion'}),
        createRestaurant({ name: 'Ushuia'}),
        createRestaurant({ name: 'Glaciers'}),
    ]);
    console.log(await fetchCustomer());
    console.log(await fetchRestaurant());

    const [reservation, reservation2] = await Promise.all([
        createReservation({
            customer_id: Jewel.id,
            restaurant_id: BryceCanyon.id,
            date: '05/22/2024',
            party_count: 4,
        }),
        createReservation({
            customer_id: Tati.id,
            restaurant_id: Zion.id,
            date: '05/25/2024',
            party_count: 4, 
        }),
        createReservation({
            customer_id: Matt.id,
            restaurant_id: Ushuia.id,
            date: '12/25/2024',
            party_count: 6,
        }),
        createReservation({
            customer_id: Joy.id,
            restaurant_id: Glaciers.id,
            date: '06/12/2024',
            party_count: 7,
        }),

    ]);
    console.log(await fetchReservation());
    await destroyReservation({id: reservation.id, customer_id: reservation.customer_id});
    console.log(await fetchReservation());

    const port = process.env.PORT || 3000;
    appendFile.listen(port, ()=> {
        console.log(`listening on port ${port}`);
        console.log('TEST OUT APP WITH curl:');
        console.log(`curl localhost:${port}/api/customer`);
        console.log(`localhost:${port}/api/restaurant`);
        console.log(`curl localhost${port}/api/reservation`);
        console.log(`curl -X DELETE localhost:${port}/api/customer/${Jewel.id}/reservation/${reservation[1].id}`);

    })
};


init();
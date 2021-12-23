const {Server, Client} = require('node-json-rpc2');
const config = require("../config/marketplace");

const id = require('crypto').randomBytes(20).toString('hex');

const marketplace = new Server({
    protocol: 'http',
    path: '/',
    port: config.port,
    method: 'GET'
});
let clients = [];

marketplace.addMethod('status', function (parameters, requestId) {
    return {id: requestId, error: null, result: {}}
});
marketplace.addMethod('registerMerchant', function (parameters, requestId) {
    const card = parameters[0];

    const merchant = new Client(card);
    merchant.call({
        method: 'ack',
        params: [id],
    }, (err, res) => {
        if (err) {
            console.log(`failed to call ${JSON.stringify(card)} ${err} ${res}`);
        } else {
            if (card.id === res.result.card.id) {
                console.log(`Successfully connected client; ${JSON.stringify(card)}`);
                clients.push(card);
            } else {
                console.log(`mismatching ids for client. did we call someone else?`);
            }
        }
    });

    return {
        id: requestId, error: null, result: {
            id: id,
        }
    }
});

setInterval(() => {
    let acks = {};
    console.log(`Got ${clients.length} connected clients.`);
    clients.forEach((card) => {
        const merchant = new Client(card);
        try {
            merchant.call({
                method: 'status',
                params: [],
            }, (err, res) => {
                if (res.result) {
                    acks[res.result['card']['id']] = true;
                }
            });
        } catch (e) {
            console.log(e);
        }
    });

    setTimeout(() => {
        console.log(`Got ${Object.keys(acks).length} acknowledgements from clients.`);
        for (let i = 0; i < clients.length; i += 1) {
            if (clients[i].id in acks) {
            } else {
                console.log(`Disconnecting ${JSON.stringify(clients[i])}`);
                clients[i] = clients[clients.length - 1];
                clients.pop();
                i -= 1;
            }
        }
    }, 5000)
}, 10000)


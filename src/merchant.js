const config = require('../config/merchant');
const {Server, Client} = require('node-json-rpc2');

const id = require('crypto').randomBytes(20).toString('hex');

const marketplace = new Client(config.marketplace);
const myCard = {
    ...config.myCard,
    id: id,
};

// set host if none set.
if (myCard.host === '') {
    const ip = require("ip");
    myCard.host = ip.address();
}

const merchant = new Server({
    protocol: 'http',
    path: '/',
    host: myCard.host,
    port: myCard.port,
    method: 'GET'
});
let marketplaceId = '';

merchant.addMethod('ack', function (parameters, requestId) {
    const currentId = parameters[0];
    if (marketplaceId === '') {
        console.log("no local marketplace set but got ack");
        return {id: requestId, error: "no local marketplace set but got ack", result: null};
    } else if (marketplaceId !== currentId) {
        console.log("local marketplace but ack has different param");
        return {id: requestId, error: "local marketplace but ack has different param", result: null};
    } else {
        console.log(`Marketplace acknowledgement successfully! ID=${currentId}`);

        // return basic status response
        return {
            id: requestId, error: null, result: {
                balance: 0,
                card: myCard,
            }
        };
    }
});
merchant.addMethod('status', function (parameters, requestId) {
    return {
        id: requestId, error: null, result: {
            balance: 0,
            card: myCard,
        }
    }
});
merchant.addMethod('fuse', function (parameters, requestId) {
    console.log('got pong');
    return {id: requestId, error: null, result: true}
});

marketplace.call({
    method: 'registerMerchant',
    params: [myCard],
}, (err, res) => {
    if (err) {
        console.log(`Register failed ... ${err}`);
        //Do something
    } else {
        marketplaceId = res.result.id;
        console.log(`Connection to marketplace established! ID=${res.result.id}`);
    }
});
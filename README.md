# Plasma Marketplace

Basic proof of concept for a plasma marketplace.

The `merchant` connects to a pre-defined `marketplace` and a handshake process takes place. The mechant acknowledges the marketplace and awaits for the marketplace to make a call to it as well.

The marketplace checks that all merchants are available each 10 seconds and disconnects them if they go offline.

---

## Example of interaction
All lines starting with `#` are run on the marketplace while the ones starting with `$` refer to commands/logs on the merchant.
```
# node src/marketplace.js`
$ node src/merchant.js
$ Connection to marketplace established! ID=0791191334313e9cacf6f380c442b1144278d6c4
$ Marketplace acknowledgement successfully! ID=0791191334313e9cacf6f380c442b1144278d6c4
# Successfully connected client; {"host":"192.168.0.25","port":8091,"id":"9ab32aded4c4a7296970e1cb0646ad6a0d6fb0f7"}
# Got 1 connected clients.
# Got 1 acknowledgements from clients.
...
# Got 1 connected clients.
# Got 1 acknowledgements from clients.
...
$ pkill -9 node
# Got 1 connected clients.
# Got 0 acknowledgements from clients.
# Disconnecting {"host":"192.168.0.25","port":8091,"id":"9ab32aded4c4a7296970e1cb0646ad6a0d6fb0f7"}
# Got 0 connected clients.
# Got 0 acknowledgements from clients.
...
```

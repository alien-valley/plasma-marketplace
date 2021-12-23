# Plasma Marketplace

Basic proof of concept for a plasma marketplace.

The `merchant` connects to a pre-defined `marketplace` and a handshake process takes place. The mechant acknowledges the marketplace and awaits for the marketplace to make a call to it as well.

The marketplace checks that all merchants are available each 10 seconds and disconnects them if they go offline.

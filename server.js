require('dotenv').config();

const axios = require('axios');
const SimplePeerServer = require('simple-peer-server');

const http = require('http');
const server = http.createServer();

const TURN_URL = new URL(
    `https://${process.env.TURN_SERVER_DOMAIN}/api/v1/turn/credentials`
);

TURN_URL.searchParams.set(
    'apiKey',
    process.env.TURN_SERVER_SECRET_KEY ?? ''
);

try {
    axios
        .get(TURN_URL.toString())
        .then((response) => {
            const config = {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    ...response.data,
                ],
            };

            new SimplePeerServer(server, true, { config });

            server.listen(process.env.PORT, () => {
                console.log('[SERVER]: Started Successfully');
            });
        });
} catch (error) {
    console.log(error);
}
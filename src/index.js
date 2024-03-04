import express from 'express';
import https from 'https';
import routes from './routes.js';
import config from './config.js'
import * as selfsigned from 'selfsigned';

const app = express();
const port = config.serverPort;

//Gera certificados auto-assinados para localhost
const attrs = [{ name: 'commonName', value: 'localhost' }];
const hostCerts = selfsigned.generate(attrs, { days: 3650, keySize: 2048 });

const options = {
    key: hostCerts.private,
    cert: hostCerts.cert,
    requestCert: true,
    rejectUnauthorized: false
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/open-banking/consents', routes);

const server = https.createServer(options, app);

server.listen(port, () => {
    console.log(`Server listening at https://localhost:${port}`);
});
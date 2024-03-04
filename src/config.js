import 'dotenv/config'

export default {
    serverPort: process.env.SERVER_PORT,
    consentIdPrefix: process.env.CONSENT_ID_PREFIX,
    consentUrlPrefix: process.env.CONSENT_URL_PREFIX
};
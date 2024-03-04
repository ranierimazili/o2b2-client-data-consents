import express from 'express';
import MemoryAdapter from './persistence.js';
import * as validations from './validations.js';
import * as results from './results.js';

const router = express.Router();
const db = new MemoryAdapter();

router.post('/v3/consents', async (req, res) => {
    const schemaValidation = validations.validateCreateConsentRequest(req.body);
    if (schemaValidation.hasErrors) {
        res.status(400).json(schemaValidation.errors);
    } else {
        const consent = await results.createConsentSucessResponseV3(req.body, db, 'v3');
        res.status(201).json(consent);
    }
});

router.get('/v3/consents/:consentId', async (req, res) => {
    const consent = await results.getConsentSucessResponseV3(req.params.consentId, db, 'v3');
    if (consent) {
        res.status(200).json(consent);
    } else {
        res.status(404).json(results.resourceNotFound());
    }
});

router.delete('/v3/consents/:consentId', async (req, res) => {
    const consent = await results.revokeConsentSucessResponseV3(req.params.consentId, db);
    if (consent) {
        res.status(204).send();
    } else {
        res.status(404).json(results.resourceNotFound());
    }
});

router.get('/v3/consents/:consentId/extensions', async (req, res) => {
});

router.post('/v3/consents/:consentId/extends', async (req, res) => {
});

export default router;
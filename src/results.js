import { v4 } from "uuid";
import config from "./config.js";

export const createConsentSucessResponseV3 = async function(payload, db, version) {
    const currentDate = new Date();
    const consentId = config.consentIdPrefix + v4();

    const result = {
        "data": {
          "consentId": consentId,
          "creationDateTime": currentDate.toISOString(),
          "status": "AWAITING_AUTHORISATION",
          "statusUpdateDateTime": currentDate.toISOString(),
          "permissions": payload.data.permissions,
          "expirationDateTime": payload.data.expirationDateTime
        },
        "links": {
          "self": config.consentUrlPrefix.replace('{version}', version) + '/' + consentId
        },
        "meta": {
          "requestDateTime": currentDate.toISOString()
        }
    };

    db.save(consentId, result);

    return result;
}

export const getConsentSucessResponseV3 = async function(consentId, db, version) {
    const currentDate = new Date();
    const consent = db.get(consentId);

    consent.links.self = config.consentUrlPrefix.replace('{version}', version) + '/' + consentId;
    consent.meta.requestDateTime = currentDate.toISOString();

    return consent;
}

export const revokeConsentSucessResponseV3 = async function(consentId, db) {
    const currentDate = new Date();
    const consent = db.get(consentId);
    
    if (consent) {
        consent.data.status = 'REVOKED';
        consent.statusUpdateDateTime = currentDate.toDateString();
        db.save(consentId, consent);
    }

    return consent;
}

export const resourceNotFound = function() {
    const currentDate = new Date();
    return {
        errors: [{
            code: "RESOURCE_NOT_FOUND",
            title: "Resource not found",
            detail: "Resource not found"
        }],
        meta: {
            requestDateTime: currentDate.toISOString()
        }
    }
}
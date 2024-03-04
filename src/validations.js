import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';
import addKeywords from 'ajv-keywords';
import fs from 'fs';

//const openapiFile = 'swagger/3.0.0-rc.1.yml'; //Mudar para ler direto do yml
const openapiFile = 'src/swagger/3.0.0-rc.1.json';
const openapiSpec = JSON.parse(fs.readFileSync(openapiFile, 'utf8'));

const ajv = new Ajv({
    allErrors: true,
    coerceTypes: 'array',
    $data: true,
    verbose: true,
    strict: false
});

addFormats(ajv);
addErrors(ajv);
addKeywords(ajv);

for (const key in openapiSpec.components.schemas) { 
    ajv.addSchema(openapiSpec.components.schemas[key], `#/components/schemas/${key}`);
}

const createConsentRequestSchema = ajv.compile(openapiSpec.components.schemas.CreateConsent);
const extendConsentRequestSchema = ajv.compile(openapiSpec.components.schemas.CreateConsentExtensions);

const validateRequest = function(schemaValidator, reqBody) {
    const isValid = schemaValidator(reqBody);

    if (!isValid) {
        const errors = schemaValidator.errors.map((error) => ({
            code: "SCHEMA_ERROR",
            title: "The request body violates the defined schema",
            details: `The attribute ${error.instancePath} ${error.message}`
        }));
        return {
            hasErrors: true,
            errors: {
                errors,
                meta: {
                    requestDateTime: (new Date()).toISOString()
                }
            }
        }
    } else {
        return {
            hasErrors: false
        }
    }
}

export const validateCreateConsentRequest = function(reqBody) {
    return validateRequest(createConsentRequestSchema, reqBody);
}

export const validateExtendConsentRequest = function(reqBody) {
    return validateRequest(extendConsentRequestSchema, reqBody);
}
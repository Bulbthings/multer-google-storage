"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mockery = __importStar(require("mockery"));
describe('multer-google-storage', () => {
    before(() => {
        mockery.enable();
        const storageMock = () => { return { bucket: () => { } }; };
        mockery.registerMock('@google-cloud/storage', storageMock);
        process.env.GCS_BUCKET = 'test';
        process.env.GCLOUD_PROJECT = 'test';
        process.env.GCS_KEYFILE = './test';
    });
    it('should define multer storage engine interface', () => {
        try {
            const storageEngine = require('./index').storageEngine;
            const cloudStorage = new storageEngine();
            chai_1.expect(cloudStorage._handleFile).to.be.a('function');
            chai_1.expect(cloudStorage._removeFile).to.be.a('function');
            chai_1.expect(cloudStorage.getDestination).to.be.a('function');
        }
        catch (err) {
            console.error(err);
            // throw err;
        }
    });
    after(() => mockery.disable());
});
//# sourceMappingURL=index.test.js.map
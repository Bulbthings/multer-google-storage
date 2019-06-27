"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mockery = require("mockery");
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
            const MulterGoogleCloudStorage = require('./index').default;
            const cloudStorage = new MulterGoogleCloudStorage();
            chai_1.expect(cloudStorage._handleFile).to.be.a('function');
            chai_1.expect(cloudStorage._removeFile).to.be.a('function');
            chai_1.expect(cloudStorage.getDestination).to.be.a('function');
        } catch (err) {
            console.log(err);
        }
    });
    after(() => mockery.disable());
});
//# sourceMappingURL=index.test.js.map

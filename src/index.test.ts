import { expect } from 'chai';
import * as mockery from 'mockery';


describe('multer-google-storage', () => {
    before(() => {
        mockery.enable();
        const storageMock = () => { return { bucket: () => { } } };
        mockery.registerMock('@google-cloud/storage', storageMock);

        process.env.GCS_BUCKET = 'test';
        process.env.GCLOUD_PROJECT = 'test';
        process.env.GCS_KEYFILE = './test';
    });

    it('should define multer storage engine interface', () => {
        try {
            const storageEngine = require('./index').storageEngine;
            const cloudStorage = new storageEngine();

            expect(cloudStorage._handleFile).to.be.a('function');
            expect(cloudStorage._removeFile).to.be.a('function');
            expect(cloudStorage.getDestination).to.be.a('function');
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    after(() => mockery.disable());
})


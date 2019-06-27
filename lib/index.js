"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v1");
const { Storage } = require('@google-cloud/storage');
class MulterGoogleCloudStorage {
    constructor(opts) {
        this.getContentType = (req, file) => {
            return undefined;
        };
        this._handleFile = (req, file, cb) => {
            this.getDestination(req, file, (err, destination) => {
                if (err) {
                    return cb(err);
                }
                this.getFilename(req, file, (err, filename) => {
                    if (err) {
                        return cb(err);
                    }
                    var gcFile = this.gcsBucket.file(filename);
                    const streamOpts = {
                        predefinedAcl: this.options.acl || 'private',
                        metadata: this.options.metadata || {}
                    };
                    const contentType = this.getContentType(req, file);
                    if (contentType) {
                        streamOpts.metadata.contentType = contentType;
                    }
                    file.stream.pipe(gcFile.createWriteStream(streamOpts))
                        .on('error', (err) => cb(err))
                        .on('finish', (file) => cb(null, {
                        path: `https://${this.options.bucket}.storage.googleapis.com/${filename}`,
                        filename: filename
                    }));
                });
            });
        };
        this._removeFile = (req, file, cb) => {
            var gcFile = this.gcsBucket.file(file.filename);
            gcFile.delete();
        };
        opts = opts || {};
        this.getFilename = (opts.filename || this.getFilename);
        this.getContentType = (opts.contentType || this.getContentType);
        opts.bucket = (opts.bucket || process.env.GCS_BUCKET || null);
        opts.projectId = opts.projectId || process.env.GCLOUD_PROJECT || null;
        opts.keyFilename = opts.keyFilename || process.env.GCS_KEYFILE || null;
        if (!opts.bucket) {
            throw new Error('You have to specify bucket for Google Cloud Storage to work.');
        }
        if (!opts.projectId) {
            throw new Error('You have to specify project id for Google Cloud Storage to work.');
        }
        if (!opts.keyFilename) {
            throw new Error('You have to specify credentials key file for Google Cloud Storage to work.');
        }
        this.gcobj = new Storage({
            projectId: opts.projectId,
            keyFilename: opts.keyFilename
        });
        this.gcsBucket = this.gcobj.bucket(opts.bucket);
        this.options = opts;
    }
    getFilename(req, file, cb) {
        cb(null, `${uuid()}_${file.originalname}`);
    }
    getDestination(req, file, cb) {
        cb(null, '');
    }
}
exports.default = MulterGoogleCloudStorage;
function storageEngine(opts) {
    return new MulterGoogleCloudStorage(opts);
}
exports.storageEngine = storageEngine;
//# sourceMappingURL=index.js.map
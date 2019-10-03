const { Transform } = require('stream');

class Guardian extends Transform {
    constructor (options = { objectMode: true }) {
        super(options);
    }

    _transform (chunk, encoding, done) {
        this.push(this._createEncryptObject(chunk));
        done();
    }

    _createEncryptObject (object) {
        object.email = this._encryptData(object.email);
        object.password = this._encryptData(object.password);

        return {
            meta: {
                source: 'ui',
            },
            payload: {
                ...object,
            }
        };
    }

    _encryptData (str)  { 
        return Buffer.from(str, 'utf8').toString('hex');
    }

    _flush (done) {
        done();
    }
}

module.exports = Guardian;
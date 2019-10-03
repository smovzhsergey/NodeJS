const { Transform } = require('stream');

class Decryptor extends Transform {
    constructor (options = { objectMode: true }) {
        super(options);
    }

    _transform (chunk, encoding, done) {
        this.push(this._createDecryptObject(chunk));
        done();
    }

    _createDecryptObject (data) {
        const {
            payload : {
                name,
                email: encryptEmail,
                password: encryptPassword,
            },
            meta: {
                algorithm
            }
        } = data;
        const email = this._decryptData(encryptEmail, algorithm);
        const password = this._decryptData(encryptPassword, algorithm);
        
        return {
            name,
            email,
            password
        };
    }

    _decryptData (val, algorithm)  {        
        return Buffer.from(val, algorithm).toString('utf8');    
    }

    _flush (done) {
        done();
    }
}

module.exports = Decryptor;
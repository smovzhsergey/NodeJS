const { Writable } = require('stream');

class AccountManager extends Writable {
    constructor(options = { objectMode: true }) {
        super(options);
        this.data = [];
    }

    _write(chunk, encoding, done) {
        console.log(chunk.payload)
        this.data.push(chunk)
        done();
    }
}

module.exports = AccountManager;
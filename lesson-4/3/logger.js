const { Transform } = require('stream');
const db = require('./DB');

class Logger extends Transform {
    constructor (options = { objectMode: true }) {
        super(options);
    }

    _transform (chunk, encoding, done) {
        const log = this._createLog(chunk);

        this.push(log);
        db.emit('add', log);
        done();
    }

    _createLog (data) {
        return {
            source: 'logger',
            payload: {
                ...data.payload,
            },
            created: new Date(),
        };
    }

    _flush (done) {
        db.emit('showAll', 'from Logger!!!');
        done();
    }
}

module.exports = Logger;

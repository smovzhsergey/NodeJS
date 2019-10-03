const { Readable } = require('stream');

class Ui extends Readable {  
    
    constructor(data = [], options = { objectMode: true }) {
        super(options);
        this._data = data;

        this.run();
    }

    run() {
        this.on('data', chunk => {
            this._checkUserData(chunk);
        });
    }

    _read() {

        let data = this._data.shift();

        if (!data) {
            this.push(null);
        } else {
            this.push(data);
        }
    }

    _checkUserData (user) {

        this._checkIsObject(user);

        const { payload, meta } = user;        

        this._checkIsObject(payload);
        this._checkIsObject(meta);

        const payloadRequiredFields = ['name', 'email', 'password'] ;
        const metaRequiredFields = ['algorithm'] ;

        this._checkData(payload, payloadRequiredFields);
        this._checkData(meta, metaRequiredFields);
    }

    _checkData (data, requiredFields) {

        const dataFields = Object.entries(data);

        for (const field of dataFields) {
            const [ fieldName, fieldValue ] = field;
            
            if (!requiredFields.includes(fieldName)) {
                throw new Error(`Unnecessary field: ${ fieldName } !`);
            }

            if (typeof fieldValue !== 'string') {
                throw new TypeError(`Field ${ fieldName } must have type "string"!`);
            }

            if (fieldName === 'algorithm') {
                if (!(fieldValue === 'hex' || fieldValue === 'base64')) {
                    throw new TypeError(`Invalid data encoding. Only 'hex' or 'base64'!`);
                }
                
            }
        }

        if (dataFields.length !== requiredFields.length) {
            const dataFieldsNames = Object.keys(data);
            
            for (const field of requiredFields) {
                if (!dataFieldsNames.includes(field)) {
                    throw new Error(`Field "${ field }" is required!`);
                }
            }
        }        
    }

    _checkIsObject (object) {
        if (typeof object !== 'object' || Array.isArray(object) || object === null) {
            this._createError();
        }
    }

    _createError () {
        throw new Error('Invalid user object');
    }
}

module.exports = Ui;
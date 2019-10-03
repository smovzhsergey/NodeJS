const { Readable } = require('stream');

class Ui extends Readable {  
    
    constructor(data = [], options = { objectMode: true }) {
        super(options);
        this._data = data;

        this.run();
    }

    run() {
        this.on('data', chunk => {
            this._checkData(chunk);
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

    _checkData (data) {
        if (typeof data !== 'object' || Array.isArray(data) || data === null) {
            throw new Error('Invalid data type');
        }

        const requiredFields = ['name', 'email', 'password'] ;

        const dataFields = Object.entries(data);

        for (const field of dataFields) {
            const [ fieldName, fieldValue ] = field;
            
            if (!requiredFields.includes(fieldName)) {
                throw new Error(`Invalid field: ${ fieldName }!`);
            }

            if (typeof fieldValue !== 'string') {
                throw new TypeError(`Field ${ fieldName } must have type "string"!`);
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
}

module.exports = Ui;
const { EventEmitter } = require('events');
const crypto = require('crypto');

class DB extends EventEmitter {
    
    constructor () {
        super();
        this.users = new Map();

        this._addListeners();
    }

    _addListeners () {
        this.on('add', this._addUser);
        this.on('showAll', this._showUsers);
    }

    _addUser (user) {
        const id = crypto.randomBytes(10).toString('hex');
        this.users.set(id, user);
    }

    _showUsers (mess) {
        console.log(`***********  ${mess}  ************`);
        console.log(this.users);
        console.log('');
        console.log('');
    }    
}

const db = new DB();

module.exports = db;

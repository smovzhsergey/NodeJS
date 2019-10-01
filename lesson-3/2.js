const EventEmmitter = require('events');
const crypto = require('crypto');

class Bank extends EventEmmitter {

    constructor () {
        super();
        this.customers = new Map();
        
        this._addListeners();
    }

    _addListeners () {
        this.on('add', this._add);
        this.on('get', this._get);
        this.on('withdraw', this._withdraw);
        this.on('send', this._send);
        this.on('error', this._error);
    }

    _checkNewCustomer (user) {

		if (typeof user !== 'object' || Array.isArray(user) || user === null) {
			this.emit ('error', Error(`The new customer isn't valid.`));
		}

        for (const customer of this.customers) {
        
            if (customer[1].name === user.name) {
                this.emit ('error', Error(`The customer with name "${ user.name }" already exists.`));
            }
        }

		const template = {
			name:		'string',
			balance:    'number',
        };

        const templateFields = Object.keys(template);

        for (const field of templateFields) {
            if (user[field] === undefined) {
                this.emit ('error',  Error(`The field "${ field }" is required in a new customer.`));
            }

            if (typeof user[field] !== template[field]) {
                this.emit ('error', Error(`Field "${ field }" of customer must be a "${ template[field] }" type.`));
            }

            if (field === 'name' & user[field].length === 0) {
                this.emit ('error', TypeError(`Customer's name can not be an empty string`));
			}
			
			if (field === 'balance' & user[field] <= 0) {
                this.emit ('error', TypeError(`Customer's balance must be more than 0`));
			}
        }		
	}

    register (customer) {

        this._checkNewCustomer(customer);
        const id = crypto.randomBytes(16).toString('hex');
        this.customers.set(id, customer);

        return id;
    }

    _add (id, sum) {

        const user = this.customers.get(id);

        this._checkAmountOfMoney(sum);
        this._checkUserExisting(user, id);
        
        user.balance += sum;
        
        this.customers.set(id, user);
    }

    _get (id, cb) {

        const user = this.customers.get(id);

        this._checkUserExisting(user, id);
        cb(user.balance);
    }

    _withdraw (id, sum) {

        const user = this.customers.get(id);

        this._checkAmountOfMoney(sum);
        this._checkUserExisting(user, id);

        if (sum <= user.balance) {
            user.balance -= sum;
        } else {
            this.emit('error', new Error(`Not enough money!!!`));
        }        
        
        this.customers.set(id, user);
    }

    _send (senderId, recipientId, amount) {

        const sender = this.customers.get(senderId);
        const recipient = this.customers.get(recipientId);

        this._checkUserExisting(sender, senderId);
        this._checkUserExisting(recipient, recipientId);
        this._checkAmountOfMoney(amount);

        this.emit('withdraw', senderId, amount);
        this.emit('add', recipientId, amount);
        // OR
        // this._withdraw(senderId, amount);
        // this._add(recipientId, amount);
    }

    _error (error) {
        console.error(`Received ${ error.name } with a message: "${ error.message }"`);
        throw error;
    }

    _checkUserExisting (user, id) {
        if (!user) {
            this.emit('error', new Error(`The customer with id = "${ id }" does not exist`));
        }
    }

    _checkAmountOfMoney (sum) {
        if (typeof sum !== 'number') {
            this.emit('error', new TypeError(`Argument "amount of money" must be a "string" type`));
        }
        if (sum <= 0 ) {
            this.emit('error', new Error(`Amount of money must be more than 0`));
        }
    }
}

const bank = new Bank();

const personFirstId = bank.register({
    name: 'Pitter Black',
    balance: 100
});
const personSecondId = bank.register({
    name: 'Oliver White',
    balance: 700
});
bank.emit('send', personFirstId, personSecondId, 50);
bank.emit('get', personSecondId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 750₴
});

exports.Bank = Bank;

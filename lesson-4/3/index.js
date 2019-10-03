const Ui = require('./ui');
const AccountManager = require('./accountManager');
const Guardian = require('./guardian');
const Logger = require('./logger');
const db = require('./db');

const customers = [
    {
        name: 'Pitter Black',
        email: 'pblack@email.com',
        password: 'pblack_123'
    },
    {
        name: 'Oliver White',
        email: 'owhite@email.com',
        password: 'owhite_456'
    }
];

const ui = new Ui(customers);
const guardian = new Guardian();
const logger = new Logger();
const manager = new AccountManager();

ui
    .pipe(guardian)
    .pipe(logger)
    .pipe(manager)
    .on('finish', () => db.emit('showAll', 'from index!!!'));
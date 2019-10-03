const Ui = require('./ui');
const AccountManager = require('./accountManager');
const Decryptor = require('./decryptor');

const customers = [
    {
        payload: {
            name: 'Pitter Black',
            email: '70626c61636b40656d61696c2e636f6d',
            password: '70626c61636b5f313233'
        },
        meta: {
            algorithm: 'hex',           
        }
    },
    {
        payload: {
            name: 'Pitter Kuck',
            email: 'cGl0dGVyLmN1Y2tAbWFpbC5jb20=',
            password: 'cGl0ODZjdWNr'
        },
        meta: {
            algorithm: 'base64'
        }
    }    
];

const ui = new Ui(customers);
const decryptor = new Decryptor();
const manager = new AccountManager();

ui.pipe(decryptor).pipe(manager).on('finish', () => { console.log(manager.data) });
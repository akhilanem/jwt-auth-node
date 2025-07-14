const bcrypt = require('bcryptjs');

const users = [
    {
        id: 1,
        username: 'akhil',
        password: bcrypt.hashSync('akhil123', 10),
        role: 'admin'
    },
    {
        id: 2,
        username: 'john',
        password: bcrypt.hashSync('john123', 8),
        role: 'user'
    }
]

module.exports = users;
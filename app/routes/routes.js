var passwordHash = require('password-hash');

const hashPassword = (password) => {
    return passwordHash.generate(password)
}

const isValidCredentials = (password = '', hash = '') => {
    return passwordHash.verify(password, hash);
}

module.exports = function(app, db) {
    app.post('/scores', (req, res) => {
        const score = { userName: req.body.userName, score: req.body.score };
        db.collection('scores').insert(score, (err, result) => {
            if (err) {
                res.send('error saving score');
            } else {
                res.send(result.ops[0]);
            }
        })
    });

    app.get('/scores', (req, res) => {
        db.collection('scores').find()
        .sort({score: -1})
        .collation({locale: "en_US", numericOrdering: true})
        .limit(5)
        .toArray((err, docs) => {
            if (err) {
                res.send('error fetching scores');
            } else {
                res.send(docs);
            }
        });
    });

    app.post('/user', (req, res) => {
        db.collection('users').findOne({userName: req.body.userName}, (err, item) => {
            if (item) {
                res.send('exists');
            } else {
                const details = { userName: req.body.userName, password: hashPassword(req.body.password) };

                db.collection('users').insert(details, (err, result) => {
                    if (err) {
                        res.send('error saving user');
                    } else {
                        res.send(result.ops[0]);
                    }
                });
            }
        });
    });

    app.get('/user', (req, res) => {
        db.collection('users').findOne({userName: req.query.userName}, (err, item) => {
            if (err) {
                res.send('no user found');	
            } else {
                if(item) {
                    validCredentials = isValidCredentials(req.query.password, item.password);
                    if(validCredentials) {
                        res.send({userName: req.query.userName});
                    } else {
                        res.send();
                    }
                } else {
                    res.send();
                }
            }	
        });
    });
}   

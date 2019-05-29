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
        const details = { userName: req.body.userName, password: req.body.password };
        db.collection('users').insert(details, (err, result) => {
            if (err) {
                res.send('error saving user');
            } else {
                res.send(result.ops[0]);
            }
        })
    });

    app.get('/user', (req, res) => {	
        const details = {userName: req.body.userName, password: req.body.password};	
        db.collection('users').findOne(details, (err, item) => {	
            if (err) {	
                res.send('error fetching user');	
            } else {	
                res.send(item);	
            }	
        });	
    });
}

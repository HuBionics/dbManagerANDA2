const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')




app.use(express.json())

const friends = {
    'james': 'friend',
    'larry': 'friend',
    'lucy': 'friend',
    'banana': 'enemy',
}

app.get('/songs', async (req, res) => {
    const songsRef = db.collection('songs')
    const doc = await songsRef.get()
    // console.log(doc.docs)
    /* if (!doc.exists) {
        return res.sendStatus(400)
    } */
    let data = [];
    doc.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        data.push(doc.data())
    });
    res.status(200).send(data)
})

app.get('/users', async (req, res) => {
    const songsRef = db.collection('users')
    const doc = await songsRef.get()
    // console.log(doc.docs)
    /* if (!doc.exists) {
        return res.sendStatus(400)
    } */
    let data = [];
    doc.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        data.push(doc.data())
    });
    res.status(200).send(data)
})

app.get('/friends/:name', (req, res) => {
    const { name } = req.params
    if (!name || !(name in friends)) {
        return res.sendStatus(404)
    }
    res.status(200).send({ [name]: friends[name] })
})

app.post('/addSong', async (req, res) => {
    const body = req.body
    const peopleRef = db.collection('songs').doc()
    //add id
    // const uid = peopleRef.id;
    // body.set("id", uid.toString);

    const res2 = await peopleRef.set(
        body
        , { merge: true })
    // friends[name] = status
    res.status(200).send(friends)
})

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.set({
        [name]: newStatus
    }, { merge: true })
    // friends[name] = newStatus
    res.status(200).send(friends)
})

app.delete('/friends', async (req, res) => {
    const { name } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.update({
        [name]: FieldValue.delete()
    })
    res.status(200).send(friends)
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))
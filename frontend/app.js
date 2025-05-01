const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const API = 'http://localhost:5000/api';

let userId = '';
let token = '';


app.get('/', async (req, res) => {
    try {
        const { data } = await axios.get(`${API}/events`);
        res.render('index', { events: data });
    } catch (err) {
        res.send('Error fetching events');
    }
});


app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
    try {
        await axios.post(`${API}/auth/register`, req.body);
        res.redirect('/login');
    } catch (err) {
        res.send('Registration failed');
    }
});


app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
    try {
        const { data } = await axios.post(`${API}/auth/login`, req.body);
        token = data.token;
        userId = data.userId;
        res.redirect('/');
    } catch (err) {
        res.send('Login failed');
    }
});


app.get('/create', (req, res) => {
    if (!token) return res.send('Please login first');
    res.render('create');
});

app.post('/create', async (req, res) => {
    try {
        await axios.post(`${API}/events`, req.body, {
            headers: { Authorization: `Bearer ${token}` }
        });
        res.redirect('/');
    } catch (err) {
        res.send('Event creation failed');
    }
});


app.post('/register-event/:id', async (req, res) => {
    try {
        await axios.post(`${API}/events/${req.params.id}/register`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        res.redirect('/');
    } catch (err) {
        res.send('Event registration failed');
    }
});


app.get('/myevents', async (req, res) => {
    try {
        const { data } = await axios.get(`${API}/users/${userId}/events`);
        res.render('events', { events: data });
    } catch (err) {
        res.send('Could not fetch your events');
    }
});


app.post('/cancel/:id', async (req, res) => {
    try {
        await axios.delete(`${API}/events/${req.params.id}/cancel/${userId}`);
        res.redirect('/myevents');
    } catch (err) {
        res.send('Failed to cancel registration');
    }
});

app.listen(PORT, () => {
    console.log(`Frontend is running at port ${PORT}`);
});
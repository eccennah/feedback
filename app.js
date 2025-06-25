const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const feedbackRoutes = require('./routes/feedback');

const app = express();
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const Feedback = require('./models/feedback');

app.use('/api/feedback', feedbackRoutes);


app.get('/', async (req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.render('index', { feedbacks });
});

app.post('/submit', async (req, res) => {
  const { name, message } = req.body;
  await Feedback.create({ name, message });
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
app.use(express.static(path.join(__dirname, 'public')));

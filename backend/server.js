require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI) // Remove the options
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Company Schema
const companySchema = new mongoose.Schema({
  name: String,
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  comments: [String],
});

const Company = mongoose.model('Company', companySchema);

// API Endpoints
app.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/companies', async (req, res) => {
  const company = new Company(req.body);
  try {
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/companies/:id/upvote', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    company.upvotes += 1;
    await company.save();
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/companies/:id/downvote', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    company.downvotes += 1;
    await company.save();
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/companies/:id/comments', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    company.comments.push(req.body.comment);
    await company.save();
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
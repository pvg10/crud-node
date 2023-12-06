const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = 3300;

// Connect to MongoDB (replace 'your-database-url' with your actual MongoDB URL)
mongoose.connect('mongodb://localhost:27017/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a mongoose schema
const Schema = mongoose.Schema;
const itemSchema = new Schema({
  name: String,
  description: String,
});

// Create a mongoose model
const Item = mongoose.model('Item', itemSchema);
app.use(cors());

app.use(bodyParser.json());

// Create operation
app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Read operation
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update operation
app.put('/items/:id', async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
  
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Update properties individually
      item.name = req.body.name || item.name;
      item.description = req.body.description || item.description;
  
      // Save the updated item
      const updatedItem = await item.save();
  
      res.json(updatedItem);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).send(error.message);
    }
  });
  

// Delete operation
app.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

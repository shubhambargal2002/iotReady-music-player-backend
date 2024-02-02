const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
require("dotenv").config()

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE = process.env.DATABASE;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(DATABASE).then(()=>{
  console.log("connected to mongoDB successfully")
}).catch((error)=>{
  console.log(error)
  console.log("error")
})

const audioSchema = new mongoose.Schema({
  filename: String,
});

const Audio = mongoose.model('Audio', audioSchema);

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('audioFile'), async (req, res) => {
    try {
      const { originalname } = req.file;
      const audio = new Audio({ filename: originalname });
      await audio.save();
      res.json({ success: true });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('/playlist', async (req, res) => {
  const playlist = await Audio.find();
  res.json(playlist);
});

app.listen(PORT, () => {
  console.log(`Music player server is running on port ${PORT}`);
});
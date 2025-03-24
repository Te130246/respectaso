require('dotenv').config(); // โหลดตัวแปรจากไฟล์ .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ดึงค่าจาก MONGO_URI
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('MONGO_URI is not defined in .env file');
    process.exit(1);
}

// เชื่อมต่อกับ MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });

// สร้าง Schema สำหรับ Users
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// สร้าง Schema สำหรับโปรไฟล์
const profileSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    bio: { type: String, required: true },
    profileImage: { type: Buffer, required: false },
    profileImageType: { type: String, required: false },
    coverImage: { type: Buffer, required: false },
    coverImageType: { type: String, required: false }
});

// สร้าง Model
const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);

// Multer setup for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(file.originalname.toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports the following filetypes - jpeg, jpg, png, gif'));
    }
});

// ฟังก์ชันแปลง Buffer เป็น Base64
function getImageUrl(buffer, type) {
    if (!buffer || !type) return null;
    return `data:${type};base64,${buffer.toString('base64')}`;
}

// API สำหรับดึงข้อมูลโปรไฟล์ทั้งหมด
app.get('/api/profiles', async (req, res) => {
    try {
        const profiles = await Profile.find();

        // แปลงรูปภาพเป็น Base64 ก่อนส่งกลับ
        const profilesWithImages = profiles.map((profile) => ({
            ...profile._doc,
            profileImage: getImageUrl(profile.profileImage, profile.profileImageType),
            coverImage: getImageUrl(profile.coverImage, profile.coverImageType),
        }));

        res.status(200).send(profilesWithImages);
    } catch (err) {
        console.error('Error fetching profiles:', err);
        res.status(500).send({ message: 'Error fetching profiles', error: err.message });
    }
});

// API สำหรับลงทะเบียนผู้ใช้
app.post('/api/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send({ message: 'Please provide all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send({ message: 'Invalid email format.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 8);
        const newUser = new User({ first_name, last_name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).send({ message: 'ลงทะเบียนสำเร็จ' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send({ message: 'Error registering user', error: err.message });
    }
});

// API สำหรับเข้าสู่ระบบผู้ใช้
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Please provide both email and password.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid Password!' });
        }

        res.status(200).send({ 
            id: user._id,
            email: user.email,
            message: 'เข้าสู่ระบบสำเร็จ',
            success: true,
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({ message: 'Error during login', error: err.message });
    }
});

// API สำหรับเพิ่มโปรไฟล์ใหม่
app.post('/api/add-profile', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const { fullName, mobile, email, location, bio } = req.body;

        // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
        if (!fullName || !mobile || !email || !location || !bio) {
            return res.status(400).send({ message: 'Please provide all required fields.' });
        }

        const newProfile = new Profile({
            fullName,
            mobile,
            email,
            location,
            bio,
            profileImage: req.files['profileImage'] ? req.files['profileImage'][0].buffer : null,
            profileImageType: req.files['profileImage'] ? req.files['profileImage'][0].mimetype : null,
            coverImage: req.files['coverImage'] ? req.files['coverImage'][0].buffer : null,
            coverImageType: req.files['coverImage'] ? req.files['coverImage'][0].mimetype : null
        });

        await newProfile.save();

        res.status(201).send({ message: 'Profile created successfully!', profileId: newProfile._id });
    } catch (err) {
        console.error('Error creating profile:', err);
        res.status(500).send({ message: 'Error creating profile', error: err.message });
    }
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `profile-${uniqueSuffix}-${file.originalname}`);
    }
})

const upload = multer({
    storage: storage,
    // only upto 5 mb file upload
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg, .jpeg and .png files are allowed!'), false);
        }
    },
});

module.exports = upload;
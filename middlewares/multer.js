import multer from 'multer';

// storage
const storage = multer.memoryStorage({})

export const singleUpload = multer({ storage }).single('file');
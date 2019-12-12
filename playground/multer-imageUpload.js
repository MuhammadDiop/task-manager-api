const multer = require('multer')
const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('File must be a Word document.'))
    }
    cb(undefined, true)
  }
})

app.post('/upload', upload.single('upload'), (req, res) => {
  res.send({ message: 'successfully uploaded.' })
}, (error, req, res, next) => {
  res.status(400).send({error: error.message})
})

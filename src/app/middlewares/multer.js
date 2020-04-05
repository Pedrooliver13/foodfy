const multer = require("multer");

// onde ele vai salvar;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});
//aqui regra de como salvar;
const fileFilter = (req, file, cb) => {
  const isAccepted = ["image/png", "image/jpg", "image/jpeg"].find(
    (isAccepetedFormat) => isAccepetedFormat == file.mimetype
  );

  if (isAccepted) return cb(null, true);

  return cb(null, false);
};

module.exports = multer({
  storage,
  fileFilter,
});

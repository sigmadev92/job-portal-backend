import multer from "multer";

const Userstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("came here for images and files");
    if (file.originalname.split("-")[0] === "resumes")
      return cb(null, "./resumes");
    else return cb(null, "./profilepics");
  },
  filename: function (req, file, cb) {
    return cb(null, file.originalname);
  },
});
const upload = multer({ storage: Userstorage });
export default upload;

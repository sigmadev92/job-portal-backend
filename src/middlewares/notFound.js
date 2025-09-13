const routeNoteFound = (req, res, next) => {
  return res.status(404).json({ success: false, message: "Route Not Found" });
};

export default routeNoteFound;

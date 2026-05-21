const { ObjectId } = require("mongodb");

const toObjectId = (id, res) => {
  try {
    return new ObjectId(id);
  } catch {
    res.status(400).json({ success: false, message: "ID tidak valid" });
    return null;
  }
};

module.exports = { toObjectId };

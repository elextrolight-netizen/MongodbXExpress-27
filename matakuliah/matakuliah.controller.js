const { getDB } = require("../config/db");
const { toObjectId } = require("../config/helper");

const col = () => getDB().collection("matakuliah");

const getAll = async (req, res) => {
  try {
    const data = await col().find().toArray();
    res.render("matakuliah/index", { page: "matakuliah", data, pesan: req.query.pesan || null });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const formTambah = (req, res) => {
  res.render("matakuliah/tambah", { page: "matakuliah", error: null });
};

const create = async (req, res) => {
  const { nama_mk, pengajar } = req.body;
  if (!nama_mk || !pengajar)
    return res.render("matakuliah/tambah", { page: "matakuliah", error: "Nama MK dan Pengajar wajib diisi" });
  try {
    await col().insertOne({ nama_mk, pengajar });
    res.redirect("/matakuliah?pesan=Matakuliah berhasil ditambahkan");
  } catch (err) {
    res.render("matakuliah/tambah", { page: "matakuliah", error: err.message });
  }
};

const formEdit = async (req, res) => {
  const _id = toObjectId(req.params.id, res);
  if (!_id) return;
  try {
    const mk = await col().findOne({ _id });
    if (!mk) return res.redirect("/matakuliah");
    res.render("matakuliah/edit", { page: "matakuliah", mk, error: null });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const update = async (req, res) => {
  const _id = toObjectId(req.params.id, res);
  if (!_id) return;
  const { nama_mk, pengajar } = req.body;
  try {
    await col().updateOne({ _id }, { $set: { nama_mk, pengajar } });
    res.redirect("/matakuliah?pesan=Matakuliah berhasil diupdate");
  } catch (err) {
    const mk = { _id: req.params.id, nama_mk, pengajar };
    res.render("matakuliah/edit", { page: "matakuliah", mk, error: err.message });
  }
};

const remove = async (req, res) => {
  const _id = toObjectId(req.params.id, res);
  if (!_id) return;
  try {
    await col().deleteOne({ _id });
    res.redirect("/matakuliah?pesan=Matakuliah berhasil dihapus");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { getAll, formTambah, create, formEdit, update, remove };

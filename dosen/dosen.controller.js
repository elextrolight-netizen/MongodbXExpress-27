const { getDB } = require("../config/db");
const { toObjectId } = require("../config/helper");

const col = () => getDB().collection("dosen");

const getAll = async (req, res) => {
  try {
    const data = await col().find().toArray();
    res.render("dosen/index", { page: "dosen", data, pesan: req.query.pesan || null });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const formTambah = (req, res) => {
  res.render("dosen/tambah", { page: "dosen", error: null });
};

const create = async (req, res) => {
  const { nip, nama } = req.body;
  if (!nip || !nama)
    return res.render("dosen/tambah", { page: "dosen", error: "NIP dan Nama wajib diisi" });
  try {
    await col().insertOne({ nip, nama });
    res.redirect("/dosen?pesan=Dosen berhasil ditambahkan");
  } catch (err) {
    res.render("dosen/tambah", { page: "dosen", error: err.message });
  }
};

const formEdit = async (req, res) => {
  const _id = toObjectId(req.params.id, res);
  if (!_id) return;
  try {
    const dsn = await col().findOne({ _id });
    if (!dsn) return res.redirect("/dosen");
    res.render("dosen/edit", { page: "dosen", dsn, error: null });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const update = async (req, res) => {
  const _id = toObjectId(req.params.id, res);
  if (!_id) return;
  const { nip, nama } = req.body;
  try {
    await col().updateOne({ _id }, { $set: { nip, nama } });
    res.redirect("/dosen?pesan=Dosen berhasil diupdate");
  } catch (err) {
    const dsn = { _id: req.params.id, nip, nama };
    res.render("dosen/edit", { page: "dosen", dsn, error: err.message });
  }
};

const remove = async (req, res) => {
  const _id = toObjectId(req.params.id, res);
  if (!_id) return;
  try {
    await col().deleteOne({ _id });
    res.redirect("/dosen?pesan=Dosen berhasil dihapus");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { getAll, formTambah, create, formEdit, update, remove };

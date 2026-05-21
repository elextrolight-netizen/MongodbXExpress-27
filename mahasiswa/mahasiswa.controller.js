const { getDB } = require("../config/db");
const { toObjectId } = require("../config/helper");
const { ObjectId } = require("mongodb");

const col = () => getDB().collection("mahasiswa");
const mkCol = () => getDB().collection("matakuliah");

const normalizeMkValue = (value) => {
  if (value && typeof value === "object" && typeof value.toString === "function") {
    const text = value.toString();
    return /^[0-9a-fA-F]{24}$/.test(text) ? text : value;
  }
  return value;
};

const resolveMatakuliahNames = async (students) => {
  const allMk = students.flatMap((mhs) => (Array.isArray(mhs.mk) ? mhs.mk : []));
  const ids = [...new Set(allMk
    .map(normalizeMkValue)
    .filter((item) => typeof item === "string" && /^[0-9a-fA-F]{24}$/.test(item))
  )];
  if (ids.length === 0) return students;

  const objectIds = ids.map((id) => new ObjectId(id));
  const matakuliahList = await mkCol().find({ _id: { $in: objectIds } }).toArray();
  const matakuliahMap = matakuliahList.reduce((acc, mk) => {
    acc[mk._id.toString()] = mk.nama_mk;
    return acc;
  }, {});

  return students.map((mhs) => {
    if (!Array.isArray(mhs.mk)) return mhs;
    mhs.mk = mhs.mk.map((item) => {
      const key = normalizeMkValue(item);
      return typeof key === "string" && matakuliahMap[key] ? matakuliahMap[key] : item;
    });
    return mhs;
  });
};

const getAll = async (req, res) => {
  try {
    const data = await col().find().toArray();
    const enrichedData = await resolveMatakuliahNames(data);
    res.render("mahasiswa/index", { page: "mahasiswa", data: enrichedData, pesan: req.query.pesan || null });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const formTambah = (req, res) => {
  res.render("mahasiswa/tambah", { page: "mahasiswa", error: null });
};

const create = async (req, res) => {
  const { nrp, nama, mk } = req.body;
  if (!nrp || !nama)
    return res.render("mahasiswa/tambah", { page: "mahasiswa", error: "NRP dan Nama wajib diisi" });
  const mkArray = mk ? mk.split(",").map((s) => s.trim()).filter(Boolean) : [];
  try {
    await col().insertOne({ nrp, nama, mk: mkArray });
    res.redirect("/mahasiswa?pesan=Mahasiswa berhasil ditambahkan");
  } catch (err) {
    res.render("mahasiswa/tambah", { page: "mahasiswa", error: err.message });
  }
};

const formEdit = async (req, res) => {
  const _id = toObjectId(req.params.id, res);
  if (!_id) return;
  try {
    const mhs = await col().findOne({ _id });
    if (!mhs) return res.redirect("/mahasiswa");
    const [enrichedMhs] = await resolveMatakuliahNames([mhs]);
    res.render("mahasiswa/edit", { page: "mahasiswa", mhs: enrichedMhs, error: null });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const update = async (req, res) => {
  const _id = toObjectId(req.params.id, res);
  if (!_id) return;
  const { nrp, nama, mk } = req.body;
  const mkArray = mk ? mk.split(",").map((s) => s.trim()).filter(Boolean) : [];
  try {
    await col().updateOne({ _id }, { $set: { nrp, nama, mk: mkArray } });
    res.redirect("/mahasiswa?pesan=Mahasiswa berhasil diupdate");
  } catch (err) {
    const mhs = { _id: req.params.id, nrp, nama, mk: mkArray };
    res.render("mahasiswa/edit", { page: "mahasiswa", mhs, error: err.message });
  }
};

const remove = async (req, res) => {
  const _id = toObjectId(req.params.id, res);
  if (!_id) return;
  try {
    await col().deleteOne({ _id });
    res.redirect("/mahasiswa?pesan=Mahasiswa berhasil dihapus");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { getAll, formTambah, create, formEdit, update, remove };

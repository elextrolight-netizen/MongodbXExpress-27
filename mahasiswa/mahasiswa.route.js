const express = require("express");
const router = express.Router();
const { getAll, formTambah, create, formEdit, update, remove } = require("./mahasiswa.controller");

router.get("/", getAll);
router.get("/tambah", formTambah);
router.post("/tambah", create);
router.get("/edit/:id", formEdit);
router.post("/edit/:id", update);
router.post("/hapus/:id", remove);

module.exports = router;

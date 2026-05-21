const express = require("express");
const { connectDB } = require("./config/db");

const mahasiswaRoute = require("./mahasiswa/mahasiswa.route");
const dosenRoute = require("./dosen/dosen.route");
const matakuliahRoute = require("./matakuliah/matakuliah.route");

const app = express();
const PORT = 3000;

// Template engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect root ke mahasiswa
app.get("/", (req, res) => res.redirect("/mahasiswa"));

// Routes
app.use("/mahasiswa", mahasiswaRoute);
app.use("/dosen", dosenRoute);
app.use("/matakuliah", matakuliahRoute);

// Start server
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Gagal konek ke MongoDB:", err.message);
    process.exit(1);
  });

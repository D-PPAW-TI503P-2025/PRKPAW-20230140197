const { Presensi, User } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.jpg
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};
exports.upload = multer({ storage: storage, fileFilter: fileFilter });

exports.CheckIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.nama;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body;
    
    const buktiFoto = req.file ? req.file.path : null; 

    const existingRecord = await Presensi.findOne({
      where: { userId, checkOut: null }
    });

    if (existingRecord) {
      return res.status(400).json({
        message: "Anda sudah melakukan check-in hari ini."
      });
    }

    const newRecord = await Presensi.create({
      userId,
      checkIn: waktuSekarang,
      latitude: latitude || null,
      longitude: longitude || null,
      buktiFoto: buktiFoto // Simpan path foto
    });

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: {
        userId: newRecord.userId,
        checkIn: newRecord.checkIn
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.nama;
    const waktuSekarang = new Date();

    const record = await Presensi.findOne({
      where: { userId, checkOut: null }
    });

    if (!record) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif."
      });
    }

    record.checkOut = waktuSekarang;
    await record.save();

    res.json({
      message: `Selamat jalan ${userName}, check-out berhasil pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: {
        userId: record.userId,
        checkIn: record.checkIn,
        checkOut: record.checkOut
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const userId = req.user.id;
    const presensiId = req.params.id;

    const record = await Presensi.findByPk(presensiId);

    if (!record) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    if (record.userId !== userId) {
      return res.status(403).json({
        message: "Akses ditolak. Anda bukan pemilik catatan ini."
      });
    }

    await record.destroy();

    res.json({ message: "Catatan presensi berhasil dihapus." });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body; 

    if (!checkIn && !checkOut) {
      return res.status(400).json({
        message: "Harus mengupdate checkIn atau checkOut."
      });
    }

    const record = await Presensi.findByPk(presensiId);

    if (!record) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    record.checkIn = checkIn || record.checkIn;
    record.checkOut = checkOut || record.checkOut;

    await record.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: record
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggal, tanggalMulai, tanggalSelesai } = req.query;
    let options = { where: {} };

    // Filter berdasarkan nama
    if (nama) {
      options.where.nama = { [Op.like]: `%${nama}%` };
    }

    // Filter berdasarkan tanggal tertentu
    if (tanggal) {
      options.where.checkIn = {
        [Op.between]: [`${tanggal} 00:00:00`, `${tanggal} 23:59:59`],
      };
    }

    // Filter berdasarkan rentang tanggal
    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [`${tanggalMulai} 00:00:00`, `${tanggalSelesai} 23:59:59`],
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil laporan presensi",
      error: error.message,
    });
  }
};

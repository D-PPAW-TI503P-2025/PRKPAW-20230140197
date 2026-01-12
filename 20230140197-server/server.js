const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require('path'); 
const iotRoutes = require("./routes/iot");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/presensi", require("./routes/presensi"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/books", require("./routes/books"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/iot", iotRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

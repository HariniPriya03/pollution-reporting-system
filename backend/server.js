const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/pollutionDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const ReportSchema = new mongoose.Schema({
    type: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    status: {
        type: String,
        default: "Pending"
    },
    priority: String,
    date: {
        type: String
    }
});

const Report = mongoose.model("Report", ReportSchema);

app.post("/api/reports", async (req, res) => {
    try {
        const { type, description, location, lat, lng, priority } = req.body;

        const newReport = new Report({
            type,
            description,
            location,
            lat,
            lng,
            priority,
            status: "Pending",
            date: new Date().toLocaleString()
        });

        await newReport.save();
        res.json({ message: "Report submitted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/reports", async (req, res) => {
    try {
        const reports = await Report.find().sort({ date: -1 });

        const total = reports.length;
        const pending = reports.filter(r => r.status === "Pending").length;
        const verified = reports.filter(r => r.status === "Verified").length;
        const resolved = reports.filter(r => r.status === "Resolved").length;

        res.json({
            reports,
            total,
            pending,
            verified,
            resolved
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/reports/verify/:id", async (req, res) => {
    try {
        await Report.findByIdAndUpdate(req.params.id, {
            status: "Verified"
        });
        res.json({ message: "Verified" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/reports/resolve/:id", async (req, res) => {
    try {
        await Report.findByIdAndUpdate(req.params.id, {
            status: "Resolved"
        });
        res.json({ message: "Resolved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/reports/:id", async (req, res) => {
    try {
        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid credentials" });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
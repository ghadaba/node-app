const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../src/models/User");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const adminEmail = "admin@test.com";
        const adminPassword = "admin123";

        // Vérifier si l'admin existe déjà
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log("Admin exists, updating role...");
            admin.role = "admin";
            await admin.save();
            console.log("Admin updated successfully");
        } else {
            const hashed = await bcrypt.hash(adminPassword, 10);

            admin = await User.create({
                name: "Admin",
                email: adminEmail,
                password: hashed,
                role: "admin"
            });

            console.log("Admin created successfully");
        }

        console.log("\nAdmin credentials:");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log(`Role: ${admin.role}`);

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

createAdmin();

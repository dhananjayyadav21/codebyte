const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    balance: Number,
    role: String
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

async function checkBalances() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env.local");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const users = await User.find({});
        console.log("Users and Balances:");
        users.forEach(u => {
            console.log(`- ${u.email} (${u.role}): $${u.balance}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
}

checkBalances();

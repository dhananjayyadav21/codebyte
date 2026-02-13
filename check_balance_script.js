const mongoose = require('mongoose');

// Hardcoded URI from .env.local for testing
const MONGODB_URI = "mongodb+srv://dhananjay:stekwise@stekwise.qkrficc.mongodb.net/code-byte";

// Defined with strict: false to see all fields
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    role: String
}, { collection: 'users', strict: false });

const User = mongoose.model('User', userSchema);

async function checkBalances() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected.");

        // Use .lean() to get raw objects
        const users = await User.find({}).lean();
        console.log("\n--- USER BALANCES ---");
        if (users.length === 0) {
            console.log("No users found.");
        } else {
            users.forEach(u => {
                console.log(`Email: ${u.email}`);
                console.log(`Name:  ${u.fullName}`);
                console.log(`Role:  ${u.role}`);
                // Log balance explicitly if it exists
                console.log(`Balance: ${u.balance}`);
                console.log(`Full Doc: ${JSON.stringify(u)}`);
                console.log('---------------------');
            });
        }

        await mongoose.disconnect();
        console.log("Disconnected.");
    } catch (error) {
        console.error("Error:", error);
    }
}

checkBalances();

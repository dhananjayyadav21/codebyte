const BASE_URL = "http://localhost:3000";

async function run() {
    try {
        console.log("1. Logging in...");
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@stakewise.com", password: "Admin@123" })
        });

        if (!loginRes.ok) {
            console.error("Login failed:", await loginRes.text());
            return;
        }

        // Extract cookie
        const cookies = loginRes.headers.get("set-cookie");
        // Normalize cookie for fetch (split by comma if multiple, join properly)
        // Actually simply passing the raw set-cookie string usually works enough for Node fetch
        console.log("Login successful. Got cookie.");

        console.log("\n2. Depositing $200...");
        const depositRes = await fetch(`${BASE_URL}/api/wallet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookies
            },
            body: JSON.stringify({ amount: 200, type: "DEPOSIT" })
        });

        const depositData = await depositRes.json();
        console.log("Deposit Response:", JSON.stringify(depositData, null, 2));

        if (!depositRes.ok) {
            console.error("Deposit failed.");
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

run();

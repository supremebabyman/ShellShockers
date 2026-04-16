const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

const websites = [
    "https://geometry.monster",
    "https://humanorganising.org",
    "https://algebra.vip",
    "https://mathdrills.info",
    "https://shellshock.io"
    // add the rest of your list here
];

async function isEmbeddable(url) {
    try {
        const res = await fetch(url, {
            method: "GET",
            redirect: "follow",
            timeout: 5000
        });

        if (!res.ok) return false;

        const xfo = (res.headers.get("x-frame-options") || "").toUpperCase();
        if (xfo.includes("DENY") || xfo.includes("SAMEORIGIN")) return false;

        const csp = res.headers.get("content-security-policy") || "";
        if (csp.includes("frame-ancestors")) return false;

        return true;

    } catch {
        return false;
    }
}

app.get("/api/find", async (req, res) => {
    for (const site of websites) {
        const ok = await isEmbeddable(site);
        if (ok) {
            return res.json({ success: true, site });
        }
    }
    res.json({ success: false });
});

app.use(express.static(".")); // serves index.html

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

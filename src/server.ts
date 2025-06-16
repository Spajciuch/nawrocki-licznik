import express from 'express';
import * as path from "path";

const app = express();
const port = process.env.PORT || 3000;


const startDate = new Date('2025-08-06');
const daysInTerm = 5 * 365;

const publicDir = path.join(__dirname, '..', 'public')
app.use(express.static(publicDir));

app.get("/", (req, res) => {
    res.send(path.join(publicDir, "index.html"));
})

app.get('/api/kadencja', (_req, res) => {
    const now = new Date();
    now.setHours(now.getHours() + 2); // UTC+2

    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;
    const msInDay = msInHour * 24;

    const endDate = new Date(startDate.getTime() + daysInTerm * msInDay);

    const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / msInDay);
    const daysRemaining = Math.max(0, daysInTerm - daysPassed);

    res.json({
        daysPassed,
        daysRemaining,
        endDate,
        daysInTerm,
        startDate
    });
});


app.listen(port, () => {
    console.log(`[server] Nasłuchiwanie na porcie: ${port}`);
});
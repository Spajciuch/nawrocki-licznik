const fillWrapper = document.querySelector('.fill-wrapper');
const spotlight = document.querySelector('.spotlight');
const container = document.querySelector('.container');

function updateSpotlightPosition() {
    const rect = fillWrapper.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Korekta pozycji względem rodzica
    const offsetX = rect.width * -0.25; // Środek sylwetki
    const offsetY = -(rect.height * 0.1); // Przybliżona pozycja głowy

    spotlight.style.left = `${rect.left - containerRect.left + offsetX}px`;
    spotlight.style.top = `${rect.top - containerRect.top + offsetY}px`;
}

window.addEventListener('resize', updateSpotlightPosition);
window.addEventListener('load', updateSpotlightPosition);
updateSpotlightPosition();

let endDateGlobal = null;
let daysInTermGlobal = null;
let startDateGlobal = null;

async function initCounter() {
    try {
        const response = await fetch('/api/kadencja');
        const data = await response.json();

        // Zapisz dane do zmiennych globalnych
        endDateGlobal = new Date(data.endDate);
        daysInTermGlobal = data.daysInTerm;
        startDateGlobal = new Date(data.startDate);  // Zakładając, że serwer zwraca startDate

        // Uruchom licznik
        updateCounter();
    } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
    }
}

function updateCounter() {
    if (!endDateGlobal || !daysInTermGlobal || !startDateGlobal) return;

    const now = new Date();
    now.setHours(now.getHours() + 2); // UTC+2

    // Oblicz pozostały czas
    const diff = endDateGlobal.getTime() - now.getTime();

    // Oblicz jednostki czasu
    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;
    const msInDay = msInHour * 24;

    const days = Math.floor(diff / msInDay);
    const hours = Math.floor((diff % msInDay) / msInHour);
    const minutes = Math.floor((diff % msInHour) / msInMinute);
    const seconds = Math.floor((diff % msInMinute) / msInSecond);

    // Oblicz procent ukończenia
    const totalDuration = daysInTermGlobal * msInDay;
    const elapsed = now.getTime() - startDateGlobal.getTime();
    let percentage = Math.min(100, (elapsed / totalDuration) * 100);
    if (percentage < 0) percentage = 0;
    // Aktualizuj UI
    document.getElementById('countdown').textContent =
        `Zostało: ${days} dni ${(hours.toString().padStart(2, '0'))}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

    document.getElementById("percentage").textContent =
        `${percentage.toFixed(2)}% ukończone`;


    if (percentage <= 5) percentage = 4.5
    document.getElementById("liquid").style.setProperty(
        '--percent',
        percentage.toFixed(2)
    );
}

// Inicjalizacja
initCounter();

// Uruchom aktualizację co sekundę
setInterval(updateCounter, 1000);

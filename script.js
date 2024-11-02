class Game {
    constructor() {
        this.cookies = 0;
        this.cookiesPerClick = 1;
        this.autoClickers = 0;
        this.autoClickPower = 1;
        this.autoClickInterval = null;

        this.clickerCosts = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500];
        this.clickerMultipliers = [10, 15, 20, 25, 30, 35, 40, 45];

        this.autoClickerCosts = [25000, 30000, 35000, 40000, 55000, 55000, 100000, 150000, 200000, 250000];
        this.autoClickerMultipliers = [10, 15, 20, 25, 30, 35, 40, 45];

        this.themes = {
            'Rood': { cost: 5000, color: '#e74c3c' },
            'Blauw': { cost: 10000, color: '#3498db' },
            'Paars': { cost: 15000, color: '#9b59b6' },
            'Roze': { cost: 20000, color: '#ff69b4' },
            'Lime': { cost: 25000, color: '#27ae60' }
        };

        this.boosterCost = 1000000;
        this.specialUpgrades = {
            'legend': 1500000,
            'pause': 2000000,
            'foetsie': 2500000
        };

        this.loadGame(); // Laad opgeslagen gegevens
        this.init();
    }

    init() {
        document.getElementById("cookie-click").addEventListener("click", () => this.clickCookie());
        this.updateCookieDisplay();
        this.initUpgrades();
        this.initAutoClickers();
        this.startAutoClickers();
        this.initBoosters();
        this.initThemes();
        this.initSpecialUpgrades();
        this.initNotifications();
        this.initMultiplayer();
    }

    clickCookie() {
        this.cookies += this.cookiesPerClick;
        this.updateCookieDisplay();
        this.saveGame(); // Sla gegevens op na elke klik
    }

    updateCookieDisplay() {
        document.getElementById("cookie-count").textContent = `Cookies: ${this.cookies}`;
    }

    initUpgrades() {
        const clickersContainer = document.getElementById("normal-clickers");
        this.clickerCosts.forEach((cost, index) => {
            const btn = document.createElement("button");
            btn.classList.add("upgrade-btn");
            btn.textContent = `Upgrade ${index + 1} - ${cost}`;
            btn.addEventListener("click", () => this.buyClickerUpgrade(index, btn));
            clickersContainer.appendChild(btn);
        });
    }

    buyClickerUpgrade(index, button) {
        const cost = this.clickerCosts[index];
        if (this.cookies >= cost) {
            this.cookies -= cost;
            this.cookiesPerClick += this.clickerMultipliers[index];
            button.disabled = true;
            this.updateCookieDisplay();
            this.saveGame(); // Sla gegevens op na aankoop
        }
    }

    initAutoClickers() {
        const autoClickersContainer = document.getElementById("auto-clickers");
        this.autoClickerCosts.forEach((cost, index) => {
            const btn = document.createElement("button");
            btn.classList.add("auto-upgrade-btn");
            btn.textContent = `Auto Clicker ${index + 1} - ${cost}`;
            btn.addEventListener("click", () => this.buyAutoClicker(index, btn));
            autoClickersContainer.appendChild(btn);
        });
    }

    buyAutoClicker(index, button) {
        const cost = this.autoClickerCosts[index];
        if (this.cookies >= cost) {
            this.cookies -= cost;
            this.autoClickers += 1; // Verhoog het aantal auto-clickers
            button.disabled = true;
            this.updateCookieDisplay();
            this.saveGame(); // Sla gegevens op na aankoop
        }
    }

    startAutoClickers() {
        this.autoClickInterval = setInterval(() => {
            this.cookies += this.autoClickers * this.autoClickPower;
            this.updateCookieDisplay();
            this.saveGame(); // Sla gegevens op na elke automatische klik
        }, 1000);
    }

    initBoosters() {
        const boosterButton = document.getElementById("booster-btn");
        boosterButton.addEventListener("click", () => {
            if (this.cookies >= this.boosterCost) {
                this.cookies -= this.boosterCost;
                this.autoClickPower *= 100;
                boosterButton.disabled = true;
                this.updateCookieDisplay();
                this.saveGame(); // Sla gegevens op na aankoop
            }
        });
    }

    initThemes() {
        const themesContainer = document.getElementById("themes");
        Object.keys(this.themes).forEach((themeId) => {
            const btn = document.createElement("button");
            btn.classList.add("theme-btn");
            btn.textContent = `${themeId} - ${this.themes[themeId].cost}`;
            btn.addEventListener("click", () => this.buyTheme(themeId, btn));
            themesContainer.appendChild(btn);
        });
    }

    buyTheme(themeId, button) {
        const cost = this.themes[themeId].cost;
        if (this.cookies >= cost) {
            this.cookies -= cost;
            document.body.style.backgroundColor = this.themes[themeId].color;
            button.disabled = true;
            this.updateCookieDisplay();
            this.saveGame(); // Sla gegevens op na aankoop
        }
    }

    initSpecialUpgrades() {
        document.getElementById("legend-mode").addEventListener("click", () => this.activateSpecial("legend"));
        document.getElementById("pause-mode").addEventListener("click", () => this.activateSpecial("pause"));
        document.getElementById("foetsie-mode").addEventListener("click", () => this.activateSpecial("foetsie"));
    }

    activateSpecial(type) {
        if (this.cookies >= this.specialUpgrades[type]) {
            this.cookies -= this.specialUpgrades[type];
            if (type === "legend") this.resetGame();
            if (type === "pause") clearInterval(this.autoClickInterval);
            if (type === "foetsie") document.getElementById("cookie-click").style.display = "none";
            this.updateCookieDisplay();
            this.saveGame(); // Sla gegevens op na activatie
        }
    }

    resetGame() {
        this.cookies = 0;
        this.cookiesPerClick = 1;
        this.autoClickers = 0; // Reset het aantal auto-clickers
        this.autoClickPower = 1;
        this.updateCookieDisplay();
        this.saveGame(); // Sla gegevens op na reset
    }

    initNotifications() {
        setInterval(() => alert("Ga door, je bent geweldig!"), 300000);
        setInterval(() => alert("Kom op, probeer nog harder!"), 600000);
        setInterval(() => alert(`Je speelt al ${Math.floor(performance.now() / 1000 / 60)} minuten!`), 900000);
    }

    initMultiplayer() {
        document.getElementById("multiplayer-btn").addEventListener("click", () => {
            alert("Multiplayer functie komt binnenkort!");
        });
    }

    saveGame() {
        // Sla de huidige status van het spel op in localStorage
        const gameState = {
            cookies: this.cookies,
            cookiesPerClick: this.cookiesPerClick,
            autoClickers: this.autoClickers,
            autoClickPower: this.autoClickPower
        };
        localStorage.setItem('cookieGame', JSON.stringify(gameState));
    }

    loadGame() {
        // Laad de opgeslagen status van het spel uit localStorage
        const savedGame = localStorage.getItem('cookieGame');
        if (savedGame) {
            const gameState = JSON.parse(savedGame);
            this.cookies = gameState.cookies || 0;
            this.cookiesPerClick = gameState.cookiesPerClick || 1;
            this.autoClickers = gameState.autoClickers || 0;
            this.autoClickPower = gameState.autoClickPower || 1;
        }
    }
}

window.onload = () => {
    new Game();
};

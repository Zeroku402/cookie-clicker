class Game {
    constructor() {
        this.cookies = 0;
        this.cookiesPerClick = 1;
        this.autoClickers = 0;
        this.autoClickPower = 1;
        this.autoClickInterval = null;

        // Kosten voor upgrades
        this.clickerCosts = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500];
        this.boosterCosts = [25000, 30000, 35000, 40000, 55000, 55000, 100000, 150000, 200000, 250000];

        // Thema's
        this.themes = {
            'purple': { cost: 10000, color: '#9b59b6' },
            'green': { cost: 20000, color: '#27ae60' },
            'black': { cost: 35000, color: '#2c3e50' },
            'pink': { cost: 40000, color: '#ff69b4' },
            'aqua': { cost: 45000, color: '#1abc9c' },
            'lightgreen': { cost: 50000, color: '#2ecc71' },
            'yellow': { cost: 55000, color: '#f1c40f' }
        };

        this.upgradesBought = []; 
        this.themesBought = []; 
        this.currentTheme = ''; 

        this.init();  
    }

    init() {
        this.loadProgress();  
        document.getElementById("cookie-click").addEventListener("click", () => this.clickCookie());
        this.updateCookieDisplay();
        this.initUpgrades();
        this.startAutoClickers();
        this.initBoosters(); // Nieuwe functie voor boosters
        this.initThemes();
        this.initNotifications(); // Nieuwe functie voor meldingen
    }

    saveProgress() {
        localStorage.setItem('cookies', this.cookies);
        localStorage.setItem('autoClickers', this.autoClickers);
        localStorage.setItem('upgradesBought', JSON.stringify(this.upgradesBought)); 
        localStorage.setItem('themesBought', JSON.stringify(this.themesBought));  
        localStorage.setItem('currentTheme', this.currentTheme);  
    }

    loadProgress() {
        this.cookies = parseInt(localStorage.getItem('cookies')) || 0;
        this.autoClickers = parseInt(localStorage.getItem('autoClickers')) || 0;
        this.upgradesBought = JSON.parse(localStorage.getItem('upgradesBought')) || [];
        this.themesBought = JSON.parse(localStorage.getItem('themesBought')) || [];
        this.currentTheme = localStorage.getItem('currentTheme') || '';

        this.applySavedUpgrades(); 
        this.applySavedThemes();    
        this.updateCookieDisplay(); 
    }

    applySavedUpgrades() {
        this.upgradesBought.forEach((index) => {
            const button = document.querySelectorAll(".upgrade-btn")[index];
            if (button) {
                button.classList.add("upgrade-bought");
                button.disabled = true;
                this.autoClickers += (index + 1) * 10; 
            }
        });
    }

    applySavedThemes() {
        if (this.currentTheme) {
            this.applyTheme(this.themes[this.currentTheme].color); 
        }

        this.themesBought.forEach((themeId) => {
            const button = document.getElementById(`${themeId}-theme`);
            if (button) {
                button.classList.add("theme-bought");
                button.disabled = true;
            }
        });
    }

    clickCookie() {
        this.cookies += this.cookiesPerClick; 
        this.updateCookieDisplay();  
    }

    updateCookieDisplay() {
        document.getElementById("cookie-count").textContent = this.cookies;
        this.saveProgress();  
    }

    initUpgrades() {
        const upgradeButtons = document.querySelectorAll(".upgrade-btn");
        upgradeButtons.forEach((button, index) => {
            button.setAttribute("data-cost", this.clickerCosts[index]);
            button.addEventListener("click", () => this.buyUpgrade(index, button));
        });
    }

    buyUpgrade(index, button) {
        const cost = parseInt(button.getAttribute("data-cost"));
        if (this.cookies >= cost && !button.classList.contains("upgrade-bought")) {
            this.cookies -= cost;
            this.autoClickers += (index + 1) * 10; 
            button.classList.add("upgrade-bought");
            button.disabled = true;

            this.upgradesBought.push(index);  
            this.updateCookieDisplay(); 
        }
    }

    startAutoClickers() {
        this.autoClickInterval = setInterval(() => {
            this.cookies += this.autoClickers * this.autoClickPower;
            this.updateCookieDisplay();
        }, 1000);  // Auto-click elke seconde
    }

    initBoosters() {
        const boosterButtons = document.querySelectorAll("#boosters .booster-btn");
        boosterButtons.forEach((button, index) => {
            button.setAttribute("data-cost", this.boosterCosts[index]);
            button.addEventListener("click", () => this.buyBooster(index, button));
        });
    }

    buyBooster(index, button) {
        const cost = parseInt(button.getAttribute("data-cost"));
        if (this.cookies >= cost && !button.classList.contains("booster-bought")) {
            this.cookies -= cost;
            this.activateBooster(index); 
            button.classList.add("booster-bought");
            button.disabled = true;
            this.updateCookieDisplay();
        }
    }

    activateBooster(index) {
        switch (index) {
            case 0:
                this.autoClickPower *= 2;
                alert("Autoclicker power boosted by x2!");
                break;
            case 1:
                this.autoClickPower *= 4;
                alert("Autoclicker power boosted by x4!");
                break;
            case 2:
                this.autoClickPower *= 6;
                alert("Autoclicker power boosted by x6!");
                break;
            case 3:
                this.autoClickPower *= 8;
                alert("Autoclicker power boosted by x8!");
                break;
            case 4:
                this.autoClickPower *= 10;
                alert("Autoclicker power boosted by x10!");
                break;
            // Voeg hier extra boosters toe als dat nodig is
            default:
                break;
        }
    }

    initThemes() {
        Object.keys(this.themes).forEach((themeId) => {
            const button = document.getElementById(`${themeId}-theme`);
            button.addEventListener("click", () => this.buyTheme(themeId, button));
        });
    }

    buyTheme(themeId, button) {
        const cost = this.themes[themeId].cost;
        if (this.cookies >= cost && !button.classList.contains("theme-bought")) {
            this.cookies -= cost;
            this.applyTheme(this.themes[themeId].color);
            button.classList.add("theme-bought");
            button.disabled = true;
            this.themesBought.push(themeId);  
            this.currentTheme = themeId;
            this.updateCookieDisplay();
        }
    }

    applyTheme(color) {
        document.body.style.backgroundColor = color;  
    }

    initNotifications() {
        // Motivatie melding elke 3 minuten
        setInterval(() => {
            alert("Houd vol! Je kunt dit! Blijf klikken!");
        }, 3 * 60 * 1000); // 3 minuten in milliseconden

        // Voortgang melding elke 10 minuten
        setInterval(() => {
            alert(`Je hebt ${this.cookies} koekjes en ${this.autoClickers} auto-clickers.`);
        }, 10 * 60 * 1000); // 10 minuten in milliseconden

        // Demotiverende melding elke 15 minuten
        setInterval(() => {
            alert("Dit is misschien niet de beste manier om je tijd te besteden...");
        }, 15 * 60 * 1000); // 15 minuten in milliseconden
    }
}

// Voorbeeld van het gebruik van de Game klasse
const game = new Game();

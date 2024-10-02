class CookieClicker {
    constructor() {
        this.cookies = 0;
        this.multiplier = 1;
        this.upgrades = [
            { cost: 50, multiplier: 10 },
            { cost: 200, multiplier: 25 },
            { cost: 500, multiplier: 50 },
            { cost: 1000, multiplier: 100 },
            { cost: 5000, multiplier: 150 },
        ];
        this.init();
    }

    init() {
        this.updateCookieCount();
        this.renderUpgrades();
        document.getElementById('click-button').addEventListener('click', () => this.clickCookie());
        document.getElementById('reset-button').addEventListener('click', () => this.resetGame());
    }

    clickCookie() {
        this.cookies += this.multiplier;
        this.updateCookieCount();
    }

    updateCookieCount() {
        document.getElementById('cookie-count').innerText = `Cookies: ${this.cookies}`;
        this.checkForReset();
    }

    renderUpgrades() {
        const upgradeList = document.getElementById('upgrade-list');
        upgradeList.innerHTML = ''; // Clear previous upgrades
        this.upgrades.forEach((upgrade, index) => {
            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = 'upgrade';
            upgradeDiv.innerHTML = `
                Upgrade Cost: ${upgrade.cost} | Multiplier: x${upgrade.multiplier}
                <button id="upgrade-${index}">Buy Upgrade</button>
            `;
            upgradeList.appendChild(upgradeDiv);
            document.getElementById(`upgrade-${index}`).addEventListener('click', () => this.buyUpgrade(index));
        });
    }

    buyUpgrade(index) {
        if (this.cookies >= this.upgrades[index].cost) {
            this.cookies -= this.upgrades[index].cost;
            this.multiplier *= this.upgrades[index].multiplier;
            this.upgrades.splice(index, 1); // Remove the upgrade after purchase
            this.updateCookieCount();
            this.renderUpgrades(); // Re-render upgrades
        } else {
            alert("Not enough cookies!");
        }
    }

    checkForReset() {
        const resetButton = document.getElementById('reset-button');
        if (this.upgrades.length === 0) {
            resetButton.style.display = 'block'; // Show reset button
        } else {
            resetButton.style.display = 'none'; // Hide reset button
        }
    }

    resetGame() {
        this.cookies = 0;
        this.multiplier = 1;
        this.upgrades = [
            { cost: 50, multiplier: 10 },
            { cost: 200, multiplier: 25 },
            { cost: 500, multiplier: 50 },
            { cost: 1000, multiplier: 100 },
            { cost: 5000, multiplier: 150 },
        ];
        this.updateCookieCount();
        this.renderUpgrades(); // Re-render upgrades
        document.getElementById('reset-button').style.display = 'none'; // Hide reset button
    }
}

window.onload = () => {
    new CookieClicker();
};

/**************
 *   Clicking & Updating
 **************/

function updateXPView(xp) {
    const xpCounter = document.querySelector('#xp_counter');
    xpCounter.innerText = xp;
}

function clickWeapon(data) {
    updateXPView(++data.totalXP);
    // renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
    producers.forEach((prod) => {
        if (coffeeCount >= prod.price / 2) prod.unlocked = true;
    });
}

function getUnlockedProducers(data) {
    return data.producers.filter((prod) => prod.unlocked);
}
function getActiveProducers(data) {
    return data.producers.filter((prod) => prod.qty > 0);
}

function makeDisplayNameFromId(id) {
    return id
        .toLowerCase()
        .split('_')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
}

function makeProducerProgress(producer) {
    const containerImg = document.createElement('img');
    containerImg.className = 'producerImg';
    containerImg.src = `images/producers/${producer}.png`;
    return containerImg;
}

function deleteAllChildNodes(parent) {
    while (parent.hasChildNodes()) parent.removeChild(parent.firstChild);
}

function renderProducers(data) {
    const prodContainer = document.querySelector('#producer_container');
    unlockProducers(data.producers, data.coffee);
    const unlockedProducers = getUnlockedProducers(data);
    deleteAllChildNodes(prodContainer);
    unlockedProducers.forEach((prod) => {
        prodContainer.append(makeProducerDiv(prod, data));
    });
}

function producerNumberCount(qty) {
    const counterDiv = document.createElement('div');
    counterDiv.className = 'prod-counter';
    counterDiv.innerHTML = `<h3>${qty}</h3>`;
    return counterDiv;
}

function renderProducersProgress(data) {}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
    return data.producers.filter((prod) => prod.id === producerId)[0];
}

function canAffordProducer(data, producerId) {
    return data.coffee >= getProducerById(data, producerId).price;
}
function canSellProducer(data, producerId) {
    return getProducerById(data, producerId).qty > 0;
}

function updateCPSView(cps) {
    const cpsSpan = document.querySelector('#cps');
    cpsSpan.innerText = cps;
}

function updatePrice(producer) {
    return Math.floor(producer.basePrice * Math.pow(1.25, producer.qty));
}

function attemptToBuyProducer(data, producerId) {
    if (canAffordProducer(data, producerId)) {
        const producer = getProducerById(data, producerId);
        producer.qty++;
        data.coffee -= producer.price;
        producer.price = updatePrice(producer);
        updateCPSView((data.totalCPS += producer.cps));
        return true;
    } else return false;
}

function attemptToSellProducer(data, producerId) {
    if (canSellProducer(data, producerId)) {
        const producer = getProducerById(data, producerId);
        producer.qty--;
        data.coffee += Math.floor(producer.price * 0.2);
        producer.price = updatePrice(producer);
        updateCPSView((data.totalCPS -= producer.cps));
        return true;
    } else return false;
}

function buyButtonHelper(event, data) {
    if (attemptToBuyProducer(data, event.target.id.slice(4))) {
        renderProducers(data);
        updateXPView(data.xp);
    } else window.alert('Not enough coffee!');
}

function sellButtonHelper(event, data) {
    if (attemptToSellProducer(data, event.target.id.slice(4))) {
        renderProducers(data);
        updateXPView(data.xp);
    } else window.alert('Not enough coffee!');
}

function buyButtonClick(event, data) {
    if (event.target.tagName === 'BUTTON') {
        if (data.fightRetreat === 'Fight') buyButtonHelper(event, data);
        else sellButtonHelper(event, data);
    }
}

function tick(data) {
    updateXPView(data.totalXP);
}

function swingWeapon(playerImg, dummyImg) {
    if (
        !playerImg.src.includes('attack.gif') &&
        !dummyImg.src.includes('dummy-hit.gif')
    ) {
        playerImg.src = '/images/character/male/animations/attack.gif';
        setTimeout(() => {
            dummyImg.src = '/images/enemies/animations/dummy-hit.gif';
        }, 100);
        setTimeout(() => {
            playerImg.src = '/images/character/male/animations/idle-static.png';
        }, 400);
        setTimeout(() => {
            dummyImg.src = '/images/enemies/static/dummy-static.png';
        }, 500);
    }
}

function dropLoot(scene) {
    if (Math.floor(Math.random() * 100 + 1) < 20) {
        const loot = document.createElement('img');
        loot.className = 'loot';
        loot.src = 'images/enemies/loot/gold.png';
        loot.draggable = false;
        loot.style.left = `${Math.random() * (11 - 7 + 1) + 7}rem`;
        loot.style.top = `${Math.random() * (6.5 - 5 + 1) + 5}rem`;
        scene.append(loot);
    }
}

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + 'header')) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + 'header').onmousedown =
            dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function createEnemyButtons(data) {
    const enemyContainer = document.querySelector('#enemies_container');
    data.enemies.forEach((enemy) => {
        const div = document.createElement('div');
        div.setAttribute('id', enemy.id);
        div.className = 'enemy';
        const html = `
            <div class="enemy-column">
              <img draggable= false class="enemy-profile" src="images/enemies/profiles/${
                  enemy.id
              }-profile.png" alt="Picture of ${enemy.id}">
              <div>
                <p class="enemy-title wb-text">${enemy.id.replace('-', ' ')}${
            enemy.id === 'training' ? '' : 's'
        }</p>
                <div class="cost">
                  <img draggable= false src="images/character/gold.png" alt="">
                  <p>${enemy.price.toLocaleString('en-US')}</p>
                </div>
              </div>
            </div>
              <div class="qty-counter">
                <p>${enemy.qty}</p>
              </div>
        `;
        div.innerHTML = html;
        enemyContainer.append(div);
    });
}

function createEnemyScene(data) {
    const battleSection = document.querySelector('#battle-section');
    data.enemies.forEach((enemy) => {
        if (enemy.id === 'training') return;
        const div = document.createElement('div');
        div.setAttribute('id', `${enemy.id}-container`);
        div.className = 'battle-scene';
        div.style.backgroundImage = `url(images/enemies/rooms/${enemy.id}-scene.png)`;
        html = `
            <img draggable= false id="player-${enemy.id}-scene" class="player-scene" src="images/character/male/animations/idle-static.png" alt="">
            <img draggable= false id="${enemy.id}-scene" class="enemy-scene" src="images/enemies/static/${enemy.id}-static.png" alt="">
            <div class="scene-divider"></div>
        `;
        div.innerHTML = html;
        battleSection.append(div);
    });
}

/*************************
 *  Start your engines!
 *************************/

if (typeof process === 'undefined') {
    let data = window.data;
    createEnemyButtons(data);
    createEnemyScene(data);

    const fightRetreat = document.querySelector('#fight-retreat');
    const panelButtons = document.querySelector('#middleTop');

    /*******************\
    |*** LEFT COLUMN ***|
    \*******************/
    const weaponIcon = document.getElementById('weapon-icon');
    const playerImg = document.querySelector('#player-dummy-scene');
    const dummyImg = document.querySelector('#dummy-scene');
    const trainingScene = document.querySelector('#training-scene');
    const leftColumn = document.querySelector('#column-left');

    dragElement(document.getElementById('character-panel'));
    dragElement(document.getElementById('weapon-icon'));
    dragElement(document.getElementById('player-info'));

    weaponIcon.addEventListener('click', () => {
        clickWeapon(data);
        swingWeapon(playerImg, dummyImg);
        dropLoot(trainingScene);
    });

    /*******************\
    |*** RIGHT COLUMN **|
    \*******************/
    const battleSection = document.querySelector('#battle-section');
    battleSection.addEventListener('click', (event) => {
        if (event.target.attributes.class.value === 'loot') {
            event.target.remove();
            data.gold++;
        }
    });

    panelButtons.addEventListener('click', (eventType) => {
        console.log(eventType.target);
    });

    const nameChange = document.querySelector('#player-name');
    const okayOrCancel = document.querySelector('#okay-cancel');
    const modal = document.querySelector('#modal');
    nameChange.addEventListener('click', () => {
        modal.style.display = 'block';
        modal.style.transition = 'display 5s';
    });

    okayOrCancel.addEventListener('click', (eventType) => {
        if (eventType.target.id === 'okay') {
            const newName = document.querySelector('#name-input');
            if (newName.value.length >= 1) {
                data.playerName = newName.value;
                nameChange.textContent = newName.value;
            }
        }
        modal.style.display = 'none';
    });

    fightRetreat.addEventListener('change', (event) => {
        data.fightRetreat = event.target.value;
        tick(data);
    });

    setInterval(() => tick(data), 1000);
}

// Exports for Node
else if (process) {
    module.exports = {
        updateXPView,
        clickWeapon,
        unlockProducers,
        getUnlockedProducers,
        makeDisplayNameFromId,
        makeProducerDiv,
        deleteAllChildNodes,
        renderProducers,
        updateCPSView,
        getProducerById,
        canAffordProducer,
        updatePrice,
        attemptToBuyProducer,
        buyButtonClick,
        tick,
    };
}

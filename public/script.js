/**************
 *   Clicking & Updating
 **************/

function playLevelUpAnimation() {
  const levelUp = document.querySelector('#levelUpAnimation');
  levelUp.src = '/images/character/levelUp.gif';
  setTimeout(() => {
    levelUp.src = '';
  }, 1500);
}

function updateXPView(xp) {
  const xpCounter = document.querySelector('#xp_counter');
  xpCounter.innerText = formatNumber(xp);
}

function updateLevelView(data) {
  if (data.totalXP >= window.levels[data.lvl]) {
    ++data.lvl;
    const lvlCounter = document.querySelector('#curr-level');
    lvlCounter.innerText = formatNumber(data.lvl);
    playLevelUpAnimation();
    unlockEnemy(data.lvl, data.enemies);
    createEnemyScene(data);
    createEnemyButtons(data);
  }
}

function clickWeapon(data) {
  data.totalXP += 1;
  updateXPView(data.totalXP);
  updateLevelView(data);
}
function formatNumber(number) {
  if (number < 1e6) return number.toLocaleString('en-US'); // less than 100,000
  else if (number < 1e9)
    return (number / 1e6).toFixed(3) + ' m'; // less than 1 billion
  else if (number < 1e12)
    return (number / 1e9).toFixed(3) + ' b'; // less than 1 trillion
  else if (number < 1e15)
    return (number / 1e12).toFixed(3) + ' t'; // less than 1 quadrillion
  else if (number < 1e18)
    return (number / 1e15).toFixed(3) + ' q'; // less than 1 quintillion
  else if (number < 1e21)
    return (number / 1e18).toFixed(3) + ' qx'; // less than 1 sextillion
  else if (number < 1e24)
    return (number / 1e21).toFixed(3) + ' sx'; // less than 1 septillion
  else return (number / 1e24).toFixed(3) + ' sp'; // septillion or more
}

function updateGoldCounter(data) {
  const currGold = document.querySelector('#totalGold');
  const unlockedEnemies = getUnlockedEnemies(data);
  unlockedEnemies.forEach((enemy) => {
    data.gold += enemy.qty * enemy.goldPerSecond;
  });
  currGold.innerText = formatNumber(data.gold);
}

/**************
 *   SLICE 2
 **************/

function unlockEnemy(currLevel, enemies) {
  enemies.forEach((enemy) => {
    if (currLevel >= enemy.unlockLevel) enemy.unlocked = true;
  });
}

function getUnlockedEnemies(data) {
  return data.enemies.filter((enemy) => enemy.unlocked);
}

function makeDisplayNameFromId(id) {
  return id
    .toLowerCase()
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function deleteAllChildNodes(parent) {
  while (parent.hasChildNodes()) parent.removeChild(parent.firstChild);
}

function renderEnemies(data, parentElement) {
  console.log(parentElement.id);
  const currEnemy = getEnemyById(data, parentElement.id);
  console.log('this is my:', currEnemy);
  if (currEnemy.qty <= 5) {
    const enemyContainer = document.querySelector(
      `#${parentElement.id}-container`
    );
    enemyContainer.innerHTML = enemyContainer.innerHTML.concat(
      ` <img draggable= false  class="enemy-scene" src="images/enemies/static/${parentElement.id}-static.png" alt=""> `
    );
  }
}

/**************
 *   SLICE 3
 **************/

function getEnemyById(data, enemyId) {
  return data.enemies.filter((enemy) => enemy.id === enemyId)[0];
}

function canAffordEnemy(data, enemyId) {
  return data.gold >= getEnemyById(data, enemyId).price;
}
function canSellProducer(data, producerId) {
  return getProducerById(data, producerId).qty > 0;
}

function updateXPSView(xpPerSecond) {
  const xpPerSecondSpan = document.querySelector('#xp_ps-container');
  xpPerSecondSpan.innerText = formatNumber(xpPerSecond);
}

function updatePrice(enemy) {
  return Math.floor(enemy.basePrice * Math.pow(1.25, enemy.qty));
}

function attemptToBuyEnemy(data, enemyElement) {
  if (canAffordEnemy(data, enemyElement.id)) {
    const enemy = getEnemyById(data, enemyElement.id);
    enemy.qty++;

    data.gold -= enemy.price;
    const currGold = document.querySelector('#totalGold');
    currGold.innerText = formatNumber(data.gold);
    const qtyCounter = enemyElement.querySelector('.qty-counter p');
    qtyCounter.innerText = formatNumber(enemy.qty);

    enemy.price = updatePrice(enemy);
    const enemyPrice = enemyElement.querySelector('.cost p');
    enemyPrice.innerText = formatNumber(enemy.price);
    updateXPSView((data.xps += enemy.xpPerSecond));
    return true;
  } else return false;
}

// function attemptToSellProducer(data, producerId) {
//   if (canSellProducer(data, producerId)) {
//     const producer = getProducerById(data, producerId);
//     producer.qty--;
//     data.coffee += Math.floor(producer.price * 0.2);
//     producer.price = updatePrice(producer);
//     updateCPSView((data.totalXP -= producer.xpPerSecond));
//     return true;
//   } else return false;
// }

function buyButtonHelper(data, parentElement) {
  if (attemptToBuyEnemy(data, parentElement)) {
    renderEnemies(data, parentElement);
  } else window.alert('Not enough gold!');
}

// function sellButtonHelper(event, data) {
//   if (attemptToSellProducer(data, event.target.id.slice(4))) {
//     renderProducers(data);
//     updateXPView(data.xp);
//   } else window.alert("Not enough coffee!");
// }

function enemyClick(data, parentElement) {
  const fightOrRetreat = document.querySelector('#fight-retreat');
  if (fightOrRetreat.value === 'Fight') buyButtonHelper(data, parentElement);
  else {
    console.log('IM TRYING TO SELL!!');
    // sellButtonHelper(event, data);
  }
}

function tick(data) {
  data.totalXP += data.xps;
  updateGoldCounter(data);
  updateXPView(data.totalXP);
  updateLevelView(data);
}

function getNewNotification() {
  const alerts = window.alerts;
  const randomIdx = Math.floor(Math.random() * alerts.length);
  return alerts[randomIdx];
}
function changeNotification() {
  const notificationElement = document.querySelector('#panel-middle');
  const newAlert = getNewNotification();
  notificationElement.textContent = `${newAlert.type}: ${newAlert.message}`;
}

function swingWeapon() {
  const player = document.querySelector('#player-dummy-scene');
  const dummy = document.querySelector('#dummy-scene');
  if (
    !player.src.includes('attack.gif') &&
    !player.src.includes('dummy-hit.gif')
  ) {
    player.src = '/images/character/male/animations/attack.gif';
    setTimeout(() => {
      dummy.src = '/images/enemies/animations/dummy-hit.gif';
    }, 100);
    setTimeout(() => {
      player.src = '/images/character/male/animations/idle-static.png';
    }, 400);
    setTimeout(() => {
      dummy.src = '/images/enemies/static/training-static.png';
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

function createEnemyButtons(data) {
  const enemyContainer = document.querySelector('#enemies_container');
  data.enemies.forEach((enemy) => {
    const enemyButtonExist = enemyContainer.querySelector(`#${enemy.id}`);
    if (enemy.unlocked && enemyButtonExist === null) {
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
                    <p>${formatNumber(enemy.price)}</p>
                  </div>
                </div>
              </div>
                <div class="qty-counter">
                  <p>${enemy.qty}</p>
                </div>
          `;
      div.innerHTML = html;
      enemyContainer.append(div);
    }
  });
}

function createEnemyScene(data) {
  const battleSection = document.querySelector('#battle-section');
  data.enemies.forEach((enemy) => {
    const sceneExist = document.querySelector(`#${enemy.id}-container`);
    if (enemy.id === 'training') return;
    else if (enemy.unlocked && sceneExist === null) {
      const div = document.createElement('div');
      div.setAttribute('id', `${enemy.id}-container`);
      div.className = 'battle-scene';
      div.style.backgroundImage = `url(images/enemies/rooms/${enemy.id}-scene.png)`;
      html = `
              <img draggable= false  class="player-scene" src="images/character/male/animations/attack.gif" alt="">
          `;
      div.innerHTML = html;
      const divider = document.createElement('div');
      divider.setAttribute('class', 'scene-divider');
      battleSection.append(div);
      battleSection.append(divider);
    }
  });
}

/*************************
 *  Start your engines!
 *************************/

if (typeof process === 'undefined') {
  let data = window.data;
  createEnemyButtons(data);
  createEnemyScene(data);

  const panelButtons = document.querySelector('#middleTop');

  /*******************\
    |*** LEFT COLUMN ***|
    \*******************/
  const weaponIcon = document.getElementById('weapon-icon');
  const playerImg = document.querySelector('#player-dummy-scene');
  const dummyImg = document.querySelector('#dummy-scene');
  const trainingScene = document.querySelector('#training-container');

  weaponIcon.addEventListener('click', () => {
    clickWeapon(data);
    swingWeapon();
    dropLoot(trainingScene);
  });

  /*******************\
    |*** MIDDLE COLUMN **|
    \*******************/
  const battleSection = document.querySelector('#battle-section');
  battleSection.addEventListener('click', (event) => {
    if (event.target.attributes.class.value === 'loot') {
      event.target.remove();
      const currGold = document.querySelector('#totalGold');
      currGold.innerText = formatNumber(++data.gold);
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

  /*******************\
    |*** RIGHT COLUMN **|
    \*******************/
  const fightRetreat = document.querySelector('#fight-retreat');

  fightRetreat.addEventListener('change', (event) => {
    data.fightRetreat = event.target.value;
    tick(data);
  });

  const enemyBlock = document.querySelector('#enemies_container');
  enemyBlock.addEventListener('click', (event) => {
    const parentElement = event.target.closest('.enemy');
    if (parentElement && parentElement.parentNode === enemyBlock) {
      enemyClick(data, parentElement);
    }
  });

  setInterval(() => tick(data), 1000);
  setInterval(() => changeNotification(), 25000);
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

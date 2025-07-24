import * as THREE from 'three';

// 1. Configuração da Cena, Câmera e Renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
const renderer = new THREE.WebGLRenderer();
renderer.sortObjects = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Carregar textura para o fundo (céu)
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
    'texturas/sky.jpg', // Substitua pelo caminho da sua imagem
    (texture) => {
        scene.background = texture;
    },
    undefined,
    (error) => {
        console.error('Erro ao carregar a textura do céu:', error);
        scene.background = new THREE.Color(0x87CEEB); // Fallback para cor sólida
    }
);

// 2. Adicionar Iluminação
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 5);
scene.add(directionalLight);

// 3. Criar o Terreno (Rua urbana sem textura)
const planeGeometry = new THREE.PlaneGeometry(50, 2000);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xA0A0A0 }); // Cinza claro
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
scene.add(plane);

// 4. Adicionar Calçadas Verdes nas Laterais
const sidewalkGeometry = new THREE.PlaneGeometry(50, 2000);
const sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 }); // Verde
const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
leftSidewalk.rotation.x = -Math.PI / 2;
leftSidewalk.position.set(-37.5, -0.51, 0); // À esquerda da pista
scene.add(leftSidewalk);

const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
rightSidewalk.rotation.x = -Math.PI / 2;
rightSidewalk.position.set(37.5, -0.51, 0); // À direita da pista
scene.add(rightSidewalk);

// 5. Adicionar Linhas Amarelas na Pista
const laneLineGeometry = new THREE.PlaneGeometry(0.5, 5);
const laneLineMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
const laneLineCount = 200;
const laneLineSpacing = 2000 / laneLineCount;

for (let i = 0; i < laneLineCount; i++) {
    const laneLine = new THREE.Mesh(laneLineGeometry, laneLineMaterial);
    laneLine.rotation.x = -Math.PI / 2;
    laneLine.position.set(0, -0.49, -1000 + i * laneLineSpacing + laneLineSpacing / 2);
    scene.add(laneLine);
}

// 6. Adicionar Túnel Cilíndrico no Início da Pista
const tunnelGeometry = new THREE.CylinderGeometry(25, 25, 20, 32, 1, true); // Raio 25, comprimento 20
const tunnelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.DoubleSide });
const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
tunnel.rotation.x = Math.PI / 2;
tunnel.position.set(0, 5, -990); // Posicionado no início da pista
scene.add(tunnel);

// Criar o interior oco do túnel
const innerTunnelGeometry = new THREE.CylinderGeometry(24, 24, 21, 32, 1, true);
const innerTunnelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.BackSide });
const innerTunnel = new THREE.Mesh(innerTunnelGeometry, innerTunnelMaterial);
innerTunnel.rotation.x = Math.PI / 2;
innerTunnel.position.set(0, 5, -990);
scene.add(innerTunnel);

// 7. Adicionar Faixa Branca de Linha de Chegada
const finishLineGeometry = new THREE.PlaneGeometry(50, 5);
const finishLineMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF }); // Cor branca
const finishLine = new THREE.Mesh(finishLineGeometry, finishLineMaterial);
finishLine.rotation.x = -Math.PI / 2;
finishLine.position.set(0, -0.49, -985); // Posicionada pouco após o túnel
scene.add(finishLine);

// 8. Adicionar Impulsos de Velocidade
function createSpeedBoost() {
    const boostGeometry = new THREE.PlaneGeometry(2, 4); // Forma de seta
    const boostMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 }); // Verde
    const boost = new THREE.Mesh(boostGeometry, boostMaterial);
    boost.rotation.x = -Math.PI / 2;
    boost.userData.isBoost = true;
    return boost;
}

const speedBoosts = [];
const numBoosts = 10;
for (let i = 0; i < numBoosts; i++) {
    const boost = createSpeedBoost();
    boost.position.set(
        (Math.random() - 0.5) * 24,
        -0.49,
        (Math.random() - 0.5) * 1900 - 50 // Evitar proximidade com a linha de chegada
    );
    scene.add(boost);
    speedBoosts.push(boost);
}

// 9. Adicionar Moedas
function createCoin() {
    const coinGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const coinMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 }); // Amarelo
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.userData.isCoin = true;
    return coin;
}

const coins = [];
const numCoins = 20; // Número de moedas na pista
for (let i = 0; i < numCoins; i++) {
    const coin = createCoin();
    coin.position.set(
        (Math.random() - 0.5) * 24,
        0.5,
        (Math.random() - 0.5) * 1900 - 50 // Evitar proximidade com a linha de chegada
    );
    scene.add(coin);
    coins.push(coin);
}

// 10. Adicionar Arcos de Moedas
function createCoinArc() {
    const arc = new THREE.Group();
    const coinArc = [];
    for (let i = 0; i < 5; i++) {
        const coin = createCoin();
        const t = i / 4; // Normalizar de 0 a 1
        const arcHeight = 2 + Math.sin(t * Math.PI) * 2; // Arco parabólico
        coin.position.set(0, arcHeight, -3 + t * 6); // Alinhado ao longo do arco
        arc.add(coin);
        coinArc.push(coin);
    }
    arc.userData.coinArc = coinArc;
    return arc;
}

const coinArcs = [];
const numCoinArcs = 5;
for (let i = 0; i < numCoinArcs; i++) {
    const arc = createCoinArc();
    arc.position.set(
        (Math.random() - 0.5) * 24,
        0,
        (Math.random() - 0.5) * 1900 - 50 // Evitar proximidade com a linha de chegada
    );
    scene.add(arc);
    coinArcs.push(arc);
}

// 11. Adicionar Casas nas Laterais da Pista com Base Verde
function createHouse() {
    const house = new THREE.Group();
    
    // Base verde simulando grama
    const baseGeometry = new THREE.BoxGeometry(8, 0.2, 8);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.1;
    house.add(base);

    // Corpo da casa com cores variadas
    const houseColors = [0xADD8E6, 0x90EE90, 0xFFFF00, 0xFFFFFF]; // Azul claro, verde claro, amarelo, branco
    const randomColor = houseColors[Math.floor(Math.random() * houseColors.length)];
    const houseBodyGeometry = new THREE.BoxGeometry(6, 4, 6);
    const houseBodyMaterial = new THREE.MeshLambertMaterial({ color: randomColor });
    const houseBody = new THREE.Mesh(houseBodyGeometry, houseBodyMaterial);
    houseBody.position.y = 2;
    house.add(houseBody);

    // Telhado
    const roofGeometry = new THREE.ConeGeometry(4.24, 2, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 5;
    roof.rotation.y = Math.PI / 4;
    house.add(roof);

    return house;
}

// 12. Adicionar Árvores
function createTree() {
    const tree = new THREE.Group();
    
    // Tronco
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Marrom
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1.5;
    tree.add(trunk);

    // Copa
    const foliageGeometry = new THREE.SphereGeometry(2, 16, 16);
    const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Verde escuro
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 4;
    tree.add(foliage);

    return tree;
}

// 13. Adicionar Praças
function createSquare() {
    const square = new THREE.Group();
    
    // Gramado
    const grassGeometry = new THREE.BoxGeometry(10, 0.2, 10);
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.y = 0.1;
    square.add(grass);

    // Banco
    const benchGeometry = new THREE.BoxGeometry(2, 0.5, 0.5);
    const benchMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const bench = new THREE.Mesh(benchGeometry, benchMaterial);
    bench.position.set(2, 0.5, 2);
    square.add(bench);

    // Árvores na praça
    for (let i = 0; i < 2; i++) {
        const tree = createTree();
        tree.position.set((i - 0.5) * 4, 0, -2);
        square.add(tree);
    }

    return square;
}

// 14. Adicionar Prédios
function createBuilding() {
    const building = new THREE.Group();
    
    // Corpo do prédio com altura e cor aleatórias
    const height = 8 + Math.random() * 12; // Altura entre 8 e 20
    const buildingGeometry = new THREE.BoxGeometry(8, height, 8);
    const buildingColors = [0xC0C0C0, 0x808080, 0xA9A9A9, 0xD3D3D3]; // Tons de cinza
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: buildingColors[Math.floor(Math.random() * buildingColors.length)] });
    const buildingBody = new THREE.Mesh(buildingGeometry, buildingMaterial);
    buildingBody.position.y = height / 2;
    building.add(buildingBody);

    return building;
}

// 15. Adicionar Elementos na Calçada
const structures = [];
const people = [];
const trackHalfLength = 2000 / 2;
const structureInterval = 50; // Intervalo maior para evitar sobrecarga
const structureTypes = ['house', 'square', 'building'];

for (let z = -trackHalfLength; z <= trackHalfLength; z += structureInterval) {
    // Lado esquerdo
    const leftType = structureTypes[Math.floor(Math.random() * structureTypes.length)];
    let leftStructure;
    switch (leftType) {
        case 'house':
            leftStructure = createHouse();
            break;
        case 'square':
            leftStructure = createSquare();
            break;
        case 'building':
            leftStructure = createBuilding();
            break;
    }
    leftStructure.position.set(-25 / 2 - 10, 0, z);
    scene.add(leftStructure);
    structures.push(leftStructure);

    // Lado direito
    const rightType = structureTypes[Math.floor(Math.random() * structureTypes.length)];
    let rightStructure;
    switch (rightType) {
        case 'house':
            rightStructure = createHouse();
            break;
        case 'square':
            rightStructure = createSquare();
            break;
        case 'building':
            rightStructure = createBuilding();
            break;
    }
    rightStructure.position.set(25 / 2 + 10, 0, z);
    scene.add(rightStructure);
    structures.push(rightStructure);

    // Adicionar pessoas ao redor das construções
    for (let i = 0; i < 2; i++) {
        const leftPerson = createPerson();
        leftPerson.position.set(
            -25 / 2 - 10 + (Math.random() - 0.5) * 5,
            0,
            z + (Math.random() - 0.5) * 5
        );
        scene.add(leftPerson);
        people.push(leftPerson);

        const rightPerson = createPerson();
        rightPerson.position.set(
            25 / 2 + 10 + (Math.random() - 0.5) * 5,
            0,
            z + (Math.random() - 0.5) * 5
        );
        scene.add(rightPerson);
        people.push(rightPerson);
    }

    // Árvores entre as construções
    if (z < trackHalfLength) {
        const leftTree = createTree();
        leftTree.position.set(-25 / 2 - 10, 0, z + structureInterval / 2);
        scene.add(leftTree);
        structures.push(leftTree);

        const rightTree = createTree();
        rightTree.position.set(25 / 2 + 10, 0, z + structureInterval / 2);
        scene.add(rightTree);
        structures.push(rightTree);
    }
}

// 16. Adicionar Pessoas
function createPerson() {
    const person = new THREE.Group();
    
    // Corpo (cilindro)
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4682B4 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    person.add(body);

    // Cabeça
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDAB9 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    person.add(head);

    return person;
}

// 17. Criar Veículos com Detalhes Mais Realistas
function createCar(color) {
    const car = new THREE.Group();
    
    // Corpo principal
    const mainBodyGeometry = new THREE.BoxGeometry(2, 0.6, 3.5);
    const mainBodyMaterial = new THREE.MeshLambertMaterial({ color });
    const mainBody = new THREE.Mesh(mainBodyGeometry, mainBodyMaterial);
    mainBody.position.y = 0.7;
    car.add(mainBody);

    // Portas
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 }); // Cor mais escura
    const doorGeometry = new THREE.BoxGeometry(0.05, 0.5, 1.8);
    const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    leftDoor.position.set(-1.01, 0.7, 0);
    car.add(leftDoor);

    const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    rightDoor.position.set(1.01, 0.7, 0);
    car.add(rightDoor);

    // Faróis
    const headlightGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.1);
    const headlightMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 }); // Amarelo
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.7, 0.5, 1.8);
    car.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.7, 0.5, 1.8);
    car.add(rightHeadlight);

    // Rodas
    const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheelPositions = [
        [-1, 0.35, 1.5],
        [1, 0.35, 1.5],
        [-1, 0.35, -1.5],
        [1, 0.35, -1.5]
    ];

    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.z = Math.PI / 2;
        car.add(wheel);
    });

    return car;
}

function createBus() {
    const bus = new THREE.Group();
    
    // Corpo principal
    const mainBodyGeometry = new THREE.BoxGeometry(2.5, 1.2, 6);
    const mainBodyMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
    const mainBody = new THREE.Mesh(mainBodyGeometry, mainBodyMaterial);
    mainBody.position.y = 1.1;
    bus.add(mainBody);

    // Janelas (várias laterais, frente e trás)
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x0000FF });
    const sideWindowGeometry = new THREE.BoxGeometry(0.1, 0.5, 1);
    const windowPositions = [
        [-1.3, 1.4, 2], // Esquerda
        [-1.3, 1.4, 0],
        [-1.3, 1.4, -2],
        [1.3, 1.4, 2],  // Direita
        [1.3, 1.4, 0],
        [1.3, 1.4, -2]
    ];

    windowPositions.forEach(pos => {
        const window = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        window.position.set(pos[0], pos[1], pos[2]);
        bus.add(window);
    });

    const frontWindowGeometry = new THREE.BoxGeometry(2.3, 0.5, 0.1);
    const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
    frontWindow.position.set(0, 1.4, 3);
    bus.add(frontWindow);

    const rearWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
    rearWindow.position.set(0, 1.4, -3);
    bus.add(rearWindow);

    // Portas
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x999999 }); // Cor mais escura
    const doorGeometry = new THREE.BoxGeometry(0.05, 0.8, 1.5);
    const frontDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    frontDoor.position.set(1.3, 1.0, 1.5);
    bus.add(frontDoor);

    const rearDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    rearDoor.position.set(1.3, 1.0, -1.5);
    bus.add(rearDoor);

    // Faróis
    const headlightGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.1);
    const headlightMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 }); // Amarelo
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.8, 0.6, 3);
    bus.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.8, 0.6, 3);
    bus.add(rightHeadlight);

    // Rodas
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheelPositions = [
        [-1.2, 0.4, 2],
        [1.2, 0.4, 2],
        [-1.2, 0.4, 0],
        [1.2, 0.4, 0],
        [-1.2, 0.4, -2],
        [1.2, 0.4, -2]
    ];

    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.z = Math.PI / 2;
        bus.add(wheel);
    });

    return bus;
}

function createBarrier() {
    const barrier = new THREE.Group();
    const coneGeometry = new THREE.ConeGeometry(0.5, 1, 4);
    const coneMaterial = new THREE.MeshLambertMaterial({ color: 0xFFA500 });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.y = 0.5;
    barrier.add(cone);

    return barrier;
}

function createPursuerCar() {
    const car = createCar(0xB22222);
    car.position.set(0, 0.5, 30); // Iniciar mais longe
    return car;
}

const player = createCar(0xFF5733);
player.position.set(0, 0.5, 0);
player.rotation.y = Math.PI; // Inverter o carro do jogador
scene.add(player);

const pursuer = createPursuerCar();
scene.add(pursuer);

// 18. Posicionar a Câmera
let isBackView = false;
camera.position.set(0, 5, 10);
camera.lookAt(player.position);

// Variáveis para controle do jogo
let gameSpeed = 0.1;
let playerSpeed = 0.1;
let defaultPlayerSpeed = 0.1;
let pursuerSpeed = 0.10;
let moveLeft = false;
let moveRight = false;
let moveForward = false;
let moveBackward = false;
let moveUp = false;
let moveDown = false;
let isJumping = false;
let isFlying = false;
let isPaused = false;
let jumpVelocity = 0;
const jumpStrength = 0.3;
const superJumpStrength = 0.6;
const gravity = 0.015;
const groundY = 0.5;
const flyHeight = 3; // Altura inicial ao voar
let slowDownTimer = 0;
const slowDownDuration = 120;
const slowDownFactor = 0.5;
let boostTimer = 0;
let isTrackBoost = false; // Rastrear se o impulso é da pista
let superJumpTimer = 0;
let flyTimer = 0;
const powerUpDuration = 600; // 10 segundos a 60 FPS
const trackBoostDuration = 420; // 7 segundos a 60 FPS
const boostFactor = 1.5; // Aumento de 50% na velocidade para impulsos da pista
const shopBoostFactor = 2.0; // Aumento de 100% na velocidade para impulso da loja
let coinCount = 0;
const coinCounterElement = document.getElementById('coin-counter');
const powerUpCounterElement = document.getElementById('powerup-counter');
const gameOverMenu = document.getElementById('game-over-menu');
const pauseMenu = document.getElementById('pause-menu');
const finalCoinCountElement = document.getElementById('final-coin-count');
const shopCoinCountElement = document.getElementById('shop-coin-count');
const powerUpBar = document.getElementById('powerup-bar');
const powerUpBarFill = document.getElementById('powerup-bar-fill');

// Carregar habilidades do localStorage
let powerUps = JSON.parse(localStorage.getItem('powerUps')) || {
    speedBoost: 0,
    superJump: 0,
    fly: 0
};

// Atualizar o contador de habilidades na inicialização
function updatePowerUpCounter() {
    if (powerUpCounterElement) {
        powerUpCounterElement.innerHTML = `
            Impulso: ${powerUps.speedBoost}<br>
            Super Salto: ${powerUps.superJump}<br>
            Voar: ${powerUps.fly}
        `;
    } else {
        console.warn('Elemento powerUpCounterElement não encontrado no DOM');
    }
}
updatePowerUpCounter();

// Atualizar a barra de duração da habilidade
function updatePowerUpBar() {
    let timer = 0;
    let maxDuration = powerUpDuration;
    if (boostTimer > 0) {
        timer = boostTimer;
        maxDuration = isTrackBoost ? trackBoostDuration : powerUpDuration;
    } else if (superJumpTimer > 0) {
        timer = superJumpTimer;
    } else if (flyTimer > 0) {
        timer = flyTimer;
    }

    if (timer > 0 && powerUpBar && powerUpBarFill) {
        powerUpBar.style.display = 'block';
        const percentage = (timer / maxDuration) * 100;
        powerUpBarFill.style.width = `${percentage}%`;
    } else if (powerUpBar) {
        powerUpBar.style.display = 'none';
    } else {
        console.warn('Elementos powerUpBar ou powerUpBarFill não encontrados no DOM');
    }
}

// Funções da Loja
window.buyPowerUp = function(type) {
    if (coinCount >= 5) {
        coinCount -= 5;
        powerUps[type]++;
        localStorage.setItem('powerUps', JSON.stringify(powerUps)); // Salvar no localStorage
        if (shopCoinCountElement) {
            shopCoinCountElement.textContent = coinCount;
        } else {
            console.warn('Elemento shopCoinCountElement não encontrado no DOM');
        }
        updatePowerUpCounter();
    } else {
        alert('Moedas insuficientes!');
    }
};

window.restartGame = function() {
    coinCount = 0; // Reiniciar moedas
    if (coinCounterElement) {
        coinCounterElement.textContent = `Moedas: ${coinCount}`;
    } else {
        console.warn('Elemento coinCounterElement não encontrado no DOM');
    }
    if (gameOverMenu) {
        gameOverMenu.style.display = 'none';
    }
    player.position.set(0, 0.5, 0);
    pursuer.position.set(0, 0.5, 30);
    isJumping = false;
    isFlying = false;
    jumpVelocity = 0;
    playerSpeed = defaultPlayerSpeed;
    boostTimer = 0;
    isTrackBoost = false;
    superJumpTimer = 0;
    flyTimer = 0;
    isPaused = false;
    animate(); // Reiniciar a animação
};

window.resumeGame = function() {
    isPaused = false;
    if (pauseMenu) {
        pauseMenu.style.display = 'none';
    }
    animate();
};

// 19. Obstáculos Dinâmicos
const obstacles = [];
const vibrantColors = [
    0xFF0000,
    0x00FF00,
    0x0000FF,
    0xFFFF00,
    0xFF00FF,
    0x00FFFF
];
const obstacleSpawnInterval = 60;
let obstacleSpawnCounter = 0;

// 20. Loop de Animação (Game Loop)
function animate() {
    if (isPaused || (gameOverMenu && gameOverMenu.style.display === 'block') || (pauseMenu && pauseMenu.style.display === 'block')) return;

    requestAnimationFrame(animate);

    // Movimento lateral e longitudinal do jogador
    const pistaLimiteX = 25 / 2 - 1;
    const pistaLimiteFrente = 2000 / 2 - 2;
    const pistaLimiteTras = -2000 / 2 + 2;
    const maxHeight = 10; // Altura máxima para voar

    if (moveLeft && player.position.x > -pistaLimiteX) {
        player.position.x -= playerSpeed;
        if (player.position.x < -pistaLimiteX) player.position.x = -pistaLimiteX;
    }
    if (moveRight && player.position.x < pistaLimiteX) {
        player.position.x += playerSpeed;
        if (player.position.x > pistaLimiteX) player.position.x = pistaLimiteX;
    }
    if (moveForward && player.position.z > pistaLimiteTras) {
        player.position.z -= playerSpeed;
        if (player.position.z < pistaLimiteTras) player.position.z = pistaLimiteTras;
    }
    if (moveBackward && player.position.z < pistaLimiteFrente) {
        player.position.z += playerSpeed;
        if (player.position.z > pistaLimiteFrente) player.position.z = pistaLimiteFrente;
    }
    if (isFlying) {
        if (moveUp && player.position.y < maxHeight) {
            player.position.y += playerSpeed;
        }
        if (moveDown && player.position.y > groundY) {
            player.position.y -= playerSpeed;
        }
    }

    // Lógica de pulo
    if (isJumping && !isFlying) {
        player.position.y += jumpVelocity;
        jumpVelocity -= gravity;
        if (player.position.y <= groundY) {
            player.position.y = groundY;
            isJumping = false;
            jumpVelocity = 0;
        }
    }

    // Restaurar velocidade após colisão
    if (slowDownTimer > 0) {
        slowDownTimer--;
        if (slowDownTimer <= 0) {
            playerSpeed = defaultPlayerSpeed;
        }
    }

    // Restaurar habilidades
    if (boostTimer > 0) {
        boostTimer--;
        if (boostTimer <= 0) {
            playerSpeed = defaultPlayerSpeed;
            isTrackBoost = false;
        }
    }
    if (superJumpTimer > 0) {
        superJumpTimer--;
    }
    if (flyTimer > 0) {
        flyTimer--;
        if (flyTimer <= 0) {
            isFlying = false;
            if (player.position.y > groundY) {
                isJumping = true; // Iniciar queda suave
                jumpVelocity = 0; // Sem velocidade inicial para a queda
            }
        }
    }

    // Atualizar barra de habilidade
    updatePowerUpBar();

    // Movimento do carro perseguidor
    const pursuerTargetX = player.position.x;
    pursuer.position.x += (pursuerTargetX - pursuer.position.x) * 0.05;
    if (pursuer.position.z > player.position.z - 15) {
        pursuer.position.z -= pursuerSpeed;
    }

    // Checar colisão com o perseguidor
    if (
        Math.abs(pursuer.position.x - player.position.x) < 2 &&
        Math.abs(pursuer.position.z - player.position.z) < 3.5 &&
        player.position.y + 0.5 <= 1.0
    ) {
        alert('Game Over! O perseguidor te alcançou!');
        window.location.reload();
        return;
    }

    // Checar se o jogador alcançou a linha de chegada
    if (
        Math.abs(player.position.z - (-985)) < 3.5 &&
        Math.abs(player.position.x) < 25 &&
        player.position.y + 0.5 <= 1.0
    ) {
        if (gameOverMenu && finalCoinCountElement && shopCoinCountElement) {
            gameOverMenu.style.display = 'block';
            finalCoinCountElement.textContent = coinCount;
            shopCoinCountElement.textContent = coinCount;
        } else {
            console.warn('Elementos gameOverMenu, finalCoinCountElement ou shopCoinCountElement não encontrados no DOM');
        }
        return;
    }

    // Checar colisão com impulsos de velocidade
    for (let i = speedBoosts.length - 1; i >= 0; i--) {
        const boost = speedBoosts[i];
        if (
            Math.abs(boost.position.x - player.position.x) < 2 &&
            Math.abs(boost.position.z - player.position.z) < 3.5 &&
            player.position.y + 0.5 <= 1.0
        ) {
            playerSpeed = defaultPlayerSpeed * boostFactor;
            boostTimer = trackBoostDuration;
            isTrackBoost = true;
            boost.position.set(
                (Math.random() - 0.5) * 24,
                -0.49,
                (Math.random() - 0.5) * 1900 - 50
            );
        }
    }

    // Checar colisão com moedas
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        if (
            Math.abs(coin.position.x - player.position.x) < 1 &&
            Math.abs(coin.position.z - player.position.z) < 1 &&
            Math.abs(coin.position.y - player.position.y) < 1
        ) {
            coinCount++;
            if (coinCounterElement) {
                coinCounterElement.textContent = `Moedas: ${coinCount}`;
            } else {
                console.warn('Elemento coinCounterElement não encontrado no DOM');
            }
            coin.position.set(
                (Math.random() - 0.5) * 24,
                0.5,
                (Math.random() - 0.5) * 1900 - 50
            );
        }
    }

    // Checar colisão com moedas dos arcos
    for (let i = coinArcs.length - 1; i >= 0; i--) {
        const arc = coinArcs[i];
        arc.userData.coinArc.forEach(coin => {
            if (
                Math.abs(coin.position.x + arc.position.x - player.position.x) < 1 &&
                Math.abs(coin.position.z + arc.position.z - player.position.z) < 1 &&
                Math.abs(coin.position.y + arc.position.y - player.position.y) < 1
            ) {
                coinCount++;
                if (coinCounterElement) {
                    coinCounterElement.textContent = `Moedas: ${coinCount}`;
                } else {
                    console.warn('Elemento coinCounterElement não encontrado no DOM');
                }
                coin.position.set(
                    (Math.random() - 0.5) * 24,
                    0.5,
                    (Math.random() - 0.5) * 1900 - 50
                );
            }
        });
    }

    // Avanço automático dos obstáculos
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.position.z += gameSpeed;

        const isBus = obs.userData.isBus || false;
        const isBarrier = obs.userData.isBarrier || false;
        const obsWidth = isBus ? 2.5 : (isBarrier ? 0.5 : 2);
        const obsLength = isBus ? 6 : (isBarrier ? 0.5 : 3.5);
        const obsHeight = isBarrier ? 1 : (isBus ? 1.2 : 1.0);

        if (
            Math.abs(obs.position.x - player.position.x) < (obsWidth + 2) / 2 &&
            Math.abs(obs.position.z - player.position.z) < (obsLength + 3.5) / 2 &&
            player.position.y + 0.5 <= obsHeight
        ) {
            playerSpeed = defaultPlayerSpeed * slowDownFactor;
            slowDownTimer = slowDownDuration;
        }

        if (obs.position.z > pistaLimiteFrente + 10) {
            scene.remove(obs);
            obstacles.splice(i, 1);
        }
    }

    // Gerar novos obstáculos
    obstacleSpawnCounter++;
    if (obstacleSpawnCounter >= obstacleSpawnInterval) {
        obstacleSpawnCounter = 0;
        let obs;
        const rand = Math.random();
        if (rand < 0.2) {
            obs = createBarrier();
            obs.userData.isBarrier = true;
            obs.userData.isBus = false;
        } else if (rand < 0.4) {
            obs = createBus();
            obs.userData.isBus = true;
            obs.userData.isBarrier = false;
        } else {
            const randomColor = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
            obs = createCar(randomColor);
            obs.userData.isBus = false;
            obs.userData.isBarrier = false;
        }
        obs.position.set(
            (Math.random() - 0.5) * 24,
            0.5,
            player.position.z - 60
        );
        scene.add(obs);
        obstacles.push(obs);
    }

    // Atualizar a câmera
    if (isBackView) {
        camera.position.set(player.position.x, player.position.y + 5, player.position.z - 10);
        camera.lookAt(pursuer.position);
    } else {
        camera.position.set(player.position.x, player.position.y + 5, player.position.z + 10);
        camera.lookAt(player.position);
    }

    renderer.render(scene, camera);
}

// Laterais da pista (paredes)
const wallThickness = 0.5;
const wallHeight = 2;
const wallLength = 2000;
const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });

const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, wallLength);
const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
leftWall.position.set(-25/2, wallHeight/2, 0);
scene.add(leftWall);

const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, wallLength);
const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
rightWall.position.set(25/2, wallHeight/2, 0);
scene.add(rightWall);

// 21. Controles do Teclado
document.addEventListener('keydown', (event) => {
    if (isPaused && event.key.toLowerCase() !== 'p') return; // Ignorar teclas exceto P quando pausado
    switch (event.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
            moveLeft = true;
            break;
        case 'arrowright':
        case 'd':
            moveRight = true;
            break;
        case 'arrowup':
        case 'w':
            moveForward = true;
            if (isFlying) moveUp = true;
            break;
        case 'arrowdown':
        case 's':
            moveBackward = true;
            if (isFlying) moveDown = true;
            break;
        case ' ':
            if (!isJumping && !isFlying) {
                isJumping = true;
                jumpVelocity = superJumpTimer > 0 ? superJumpStrength : jumpStrength;
            }
            break;
        case 'f':
            isBackView = !isBackView;
            break;
        case 'q':
            if (powerUps.speedBoost > 0 && boostTimer <= 0) {
                powerUps.speedBoost--;
                playerSpeed = defaultPlayerSpeed * shopBoostFactor;
                boostTimer = powerUpDuration;
                isTrackBoost = false;
                localStorage.setItem('powerUps', JSON.stringify(powerUps)); // Salvar no localStorage
                updatePowerUpCounter();
            }
            break;
        case 'e':
            if (powerUps.superJump > 0 && superJumpTimer <= 0) {
                powerUps.superJump--;
                superJumpTimer = powerUpDuration;
                localStorage.setItem('powerUps', JSON.stringify(powerUps)); // Salvar no localStorage
                updatePowerUpCounter();
            }
            break;
        case 'r':
            if (powerUps.fly > 0 && flyTimer <= 0 && !isJumping && !isFlying) {
                powerUps.fly--;
                isFlying = true;
                flyTimer = powerUpDuration;
                player.position.y = flyHeight; // Levanta o carro para a altura inicial
                localStorage.setItem('powerUps', JSON.stringify(powerUps)); // Salvar no localStorage
                updatePowerUpCounter();
            }
            break;
        case 'p':
            isPaused = !isPaused;
            if (pauseMenu) {
                pauseMenu.style.display = isPaused ? 'block' : 'none';
            }
            if (!isPaused) animate();
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
            moveLeft = false;
            break;
        case 'arrowright':
        case 'd':
            moveRight = false;
            break;
        case 'arrowup':
        case 'w':
            moveForward = false;
            moveUp = false;
            break;
        case 'arrowdown':
        case 's':
            moveBackward = false;
            moveDown = false;
            break;
    }
});

// Iniciar o loop de animação
animate();
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

// ---- Joueur ----
let player = {
  x: 300,
  y: 300,
  size: 12,
  speed: 4,
  img: new Image(),
  alive: true
};
player.img.src = "assets/player/heartplayer.png"; // PNG

// ---- Ennemi ----
const enemy = new Image();
enemy.src = "assets/enemies/enemy.webp"; // WebP

const blaster = new Image();
blaster.src = "assets/enemies/blaster.gif"; // GIF animé

// ---- Projectiles (bones) ----
let bones = [];

function spawnBone(type){
  bones.push({
    x: Math.random()*500 + 50,
    y: -20,
    width: 12,
    height: 12,
    type: type,
    speed: Math.random()*2 + 2
  });
}

// ---- Boîte de combat ----
let box = {
  x: player.x - 10,
  y: player.y - 10,
  width: 34,
  height: 34
};

// ---- UI ----
const ui = new Image();
ui.src = "assets/ui/ui.png"; // PNG unique avec tous les boutons

// Boutons sur l'image unique
const buttons = {
  fight: {x:0, y:0, width:140, height:50},
  act:   {x:140, y:0, width:140, height:50},
  item:  {x:280, y:0, width:140, height:50},
  mercy: {x:420, y:0, width:140, height:50}
};

// ---- Mouvement joueur ----
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update(){
  if(keys["ArrowUp"]) player.y -= player.speed;
  if(keys["ArrowDown"]) player.y += player.speed;
  if(keys["ArrowLeft"]) player.x -= player.speed;
  if(keys["ArrowRight"]) player.x += player.speed;

  // Limites du canvas
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Déplacer les bones
  bones.forEach(b => b.y += b.speed);

  // Retirer bones hors écran
  bones = bones.filter(b => b.y < canvas.height);

  // Collision joueur <-> bones
  bones.forEach(b => {
    if(player.x < b.x + b.width &&
       player.x + player.size > b.x &&
       player.y < b.y + b.height &&
       player.y + player.size > b.y){
         player.alive = false;
       }
  });
}

// ---- Dessin ----
function draw(){
  ctx.fillStyle = "#002921";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ennemi
  ctx.drawImage(enemy, 250, 50, 100, 100);

  // Blaster animé
  ctx.drawImage(blaster, 200, 150, 200, 100);

  // Joueur
  if(player.alive)
    ctx.drawImage(player.img, player.x, player.y, player.size, player.size);
  else {
    ctx.fillStyle = "red";
    ctx.font = "30px monospace";
    ctx.fillText("GAME OVER", 220, 200);
  }

  // Bones
  bones.forEach(b => {
    const img = new Image();
    img.src = b.type === "bone1" ? "assets/projectiles/bone1.png" : "assets/projectiles/bone2.png";
    ctx.drawImage(img, b.x, b.y, b.width, b.height);
  });

  // UI (image unique)
  ctx.drawImage(ui, 0, canvas.height - 60, 560, 50);
}

// ---- Clic sur UI ----
canvas.addEventListener("click", function(e){
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const uiY = canvas.height - 60;

  for(let btn in buttons){
    const b = buttons[btn];
    if(mouseX >= b.x && mouseX <= b.x + b.width &&
       mouseY >= uiY + b.y && mouseY <= uiY + b.y + b.height){
         console.log(btn + " clicked!");
         if(btn === "fight") spawnBone("bone1");
         if(btn === "act") spawnBone("bone2");
         if(btn === "item") console.log("Item utilisé");
         if(btn === "mercy") console.log("Mercy !");
    }
  }
});

// ---- Boucle principale ----
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
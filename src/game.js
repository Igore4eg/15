const fifteen = {
  Move: {up: -4, left: -1, down: 4, right: 1},
  order: [ ...Array(16) ].map((_, i) => i = {id: i+1, data: i}),

  getNull: function() {
    k = this.order.findIndex(_ => _.id === 0); 
    return k;
  },
  findIndex: function(el) {
    k = this.order.findIndex(_ => _.id === +el); 
    return k;
  },
  isCompleted: function(array) {
    for (let i = 0; i < array.length - 1; i++){
        if (i + 1 == array[i].id){ 
          continue; 
        }
        else { 
          return false;
        }
    }
    return true;
  },
  go: function(move) {
    let hole = this.getNull();
    let index = hole + move;
    if (!this.order[index]) return false;
    if (move === this.Move.left || move === this.Move.right)
      if (Math.floor(hole/4) !== Math.floor(index/4)) return false;
    this.swap(index, hole);
    hole = index;
    return [true, hole, hole-move]; 
  },
  swap: function(i1, i2) { 
    let t = this.order[i1]; 
    this.order[i1] = this.order[i2]; 
    this.order[i2] = t; 
  },
  getRandomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  },
  getCellsForMovement: function(k){
    const n = 4;
    const arr = [
      [ k-1, 'h', ],
      [ k+1, 'h', ],
      [ k-n, 'v', ],
      [ k+n, 'v', ],
    ].filter(([_, flag]) => flag === 'h'
      ? Math.floor(_ / n) === Math.floor(k / n)
      : flag === 'v'
        ? _ > 0 && _ < n*n
        : 0
    ).map(([value, key]) => value);
    return arr;
  },
  mix: function(){
    let m = this.getRandomInt(50, 500);
    for(let i = 0; i < m; i++){
      let n = this.getNull();
      let arr = this.getCellsForMovement(n);
      let r =  this.getRandomInt(0, arr.length-1);
      this.swap(n, arr[r])
    }
  },
};

let scores = 0;

function exchangeElements(el1, el2) {
  const parentEl1 = el1.parentNode;
  const parentEl2 = el2.parentNode;
  parentEl1.appendChild(el2);
  parentEl2.appendChild(el1);
  scores++
  scoreOutput.value = scores;
}



let image = new Image();

const importImage = document.body.appendChild(document.createElement('input'));
importImage.type = "file";
importImage.id = 'inputFile';
importImage.accept = ".png, .jpg, .jpeg";
importImage.addEventListener("change", startGame);

async function inputFile() {
  return new Promise((resolve, reject) => {
    let file = document.querySelector('#inputFile').files[0];
    let reader = new FileReader();
  
    reader.onload = function() {
      image.src =  reader.result;
      image.onload = function() {
        resolve();
      } 
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function startGame(){
  try {
    await inputFile();
    cutImageUp(image);
    importImage.hidden = true;
    fifteen.mix();
    draw();
    drag();
    mixGame.hidden = false;
  }catch(e) {
    console.log(e);
  }
}

function cutImageUp(elem) {
  for(let x = 0; x < 4; ++x) {
    for(let y = 0; y < 4; ++y) {
      let canvas = document.createElement('canvas');
      canvas.width = elem.width / 4;
      canvas.height = elem.height / 4;
      let context = canvas.getContext('2d');
      context.drawImage(elem, y * canvas.width, x * canvas.height, elem.width / 4, elem.height / 4, 0, 0, canvas.width, canvas.height);
      let item = x * 4 + y;
      fifteen.order[item].data =  canvas.toDataURL()
    }
  }
  fifteen.order[15].id = 0;
  fifteen.order[15].data = null;
} 

const box = document.body.appendChild(document.createElement('div'));

box.setAttribute("id", "box");
box.style.marginTop = "20px";
box.style.width = "456px";
box.style.border = "solid 1px transparent";
for (let i = 0; i < 16; i++) {
  let outDiv = box.appendChild(document.createElement('div'));
  outDiv.setAttribute("class", "outerDiv");
  outDiv.style.display = "inline-block";
  outDiv.style.width = "100px";
  outDiv.style.height = "100px";
  outDiv.style.border = "solid 2px gray";
  outDiv.style.margin = "2px";
  outDiv.style.textAlign = "center";
  outDiv.style.backgroundColor = "whitesmoke";
  outDiv.style.boxSizing = "border-box";
  let inDiv = outDiv.appendChild(document.createElement('div'));
  inDiv.setAttribute("class", "innerDiv");
};
let scoreOutput = document.createElement('input');
scoreOutput.setAttribute("id", "score");
box.after(scoreOutput);
scoreOutput.value = scores;
scoreOutput.setAttribute("readonly", true);

let mixGame = document.createElement("button");
mixGame.setAttribute("id", "mixGame");
mixGame.innerHTML = "Mix";
mixGame.hidden = true;
scoreOutput.after(mixGame);
mixGame.onclick = function() { 
  fifteen.mix();
  removeAllEventDrag();
  console.log("removeallevent")
  draw();
  delDraggable();
  addDraggable();
  drag();
  scoreOutput.value = 0;
};

window.addEventListener('keydown', function(e) {
  const result = fifteen.go(fifteen.Move[{37: 'left', 39: 'right', 38: 'up', 40: 'down'}[e.keyCode]]);
  if (result[0]) {
      let el1 = document.querySelector(`[id='${fifteen.order[result[1]].id}']`);
      let el2 = document.querySelector(`[id='${fifteen.order[result[2]].id}']`);

      exchangeElements(el1, el2); 
      delDraggable();
      //removeAllEventDrag(); 
      addDraggable();
      let dragArrayAdd = fifteen.getCellsForMovement(fifteen.getNull());
      dragArrayAdd.forEach(function (item) {
        let el = document.querySelector(`[id='${fifteen.order[item].id}']`);
        el.addEventListener('dragstart', dragStart);
        el.addEventListener('dragend', dragEnd);
      });   

      if (fifteen.isCompleted(fifteen.order)) {
        box.style.backgroundColor = "gold";
        window.removeEventListener('keydown', arguments.callee);
        delDraggable();
        removeAllEventDrag();
      }
  }
});

function draw() {
  let k = 1;
  if (image.width > 1000){
    k = 1000 / Math.max(image.width, image.height);
  } 
  let boxWidth = k * image.width + 32;
  box.style.width = boxWidth + "px";
  let inDiv = document.querySelectorAll('div.innerDiv');
  let i = 0;
  inDiv.forEach(el => {
    el.style.width = k * image.width/4 + "px";
    el.style.height = k * image.height/4 + "px";
    el.style.maxWidth = 200 + "px";
    el.textContent = fifteen.order[i].id;
    el.id = fifteen.order[i].id;
    el.style.backgroundImage = `url('${fifteen.order[i].data}')`;
    el.style.backgroundRepeat =  'no-repeat';
    el.style.backgroundSize = "contain";
    el.style.userSelect = "none";
    i++;
    }
  );
  addDraggable();
  let outDiv = document.querySelectorAll('div.outerDiv');
  outDiv.forEach(elem => {
    elem.style.width = "unset";
    elem.style.height = "unset";
    elem.style.backgroundColor = "whitesmoke";
  });
  
}

function addDraggable() {
  const dragArray = fifteen.getCellsForMovement(fifteen.getNull());
  dragArray.forEach(function (item) {
    let el = document.querySelector(`[id='${fifteen.order[item].id}']`);
    el.draggable = true;
  });
}

function delDraggable() {
  let inDiv = document.querySelectorAll('div.innerDiv');
  inDiv.forEach(el => {
    el.draggable = false;
  })
}

const dragStart = function(e) {
  this.style.opacity = "0.5";
  e.dataTransfer.setData("text", e.target.id);

};
const dragEnd = function() {
  this.style.opacity = "1";
};

const removeAllEventDrag = function() {
  let inDiv = document.querySelectorAll('div.innerDiv');
  inDiv.forEach(function (el) {
    el.removeEventListener('dragstart', dragStart);
    el.removeEventListener('dragend', dragEnd);
    el.removeEventListener('dragenter', dragEnter);
    el.removeEventListener('dragleave', dragLeave);
    el.removeEventListener('dragover', dragOver);
    el.removeEventListener('drop', dragDrop);
  }); 
};

const dragEnter = function(evt) {
  evt.preventDefault();
  this.style.backgroundColor = "#20B2AA";
}
const dragLeave = function() {
  this.style.backgroundColor = "whitesmoke";
}
const dragOver = function(evt) {
  evt.preventDefault();
}
const dragDrop = function(e){
  const dropCell = document.querySelector(`[id='${fifteen.order[fifteen.getNull()].id}']`);
  const dragID = e.dataTransfer.getData("text");;
  let draggable = document.querySelector(`[id='${dragID}']`);
  fifteen.swap(fifteen.getNull(), fifteen.findIndex(dragID));
  this.style.backgroundColor = "whitesmoke";
  exchangeElements(dropCell, draggable);
  delDraggable();
  removeAllEventDrag();
  addDraggable();
  let dragArrayAdd = fifteen.getCellsForMovement(fifteen.getNull());
  dragArrayAdd.forEach(function (item) {
    let el = document.querySelector(`[id='${fifteen.order[item].id}']`);
    el.addEventListener('dragstart', dragStart);
    el.addEventListener('dragend', dragEnd);
  });
  if (fifteen.isCompleted(fifteen.order)) {
    box.style.backgroundColor = "gold";
    window.removeEventListener('keydown', arguments.callee); 
    delDraggable();
    removeAllEventDrag();
  }
};


function drag(){
  let dropCell = document.querySelector(`[id='${fifteen.order[fifteen.getNull()].id}']`);
  let dragArray = fifteen.getCellsForMovement(fifteen.getNull());
  let inDiv = document.querySelectorAll('div.innerDiv');
  

  dragArray.forEach(function (item) {
    let el = document.querySelector(`[id='${fifteen.order[item].id}']`);
    el.addEventListener('dragstart', dragStart);
    el.addEventListener('dragend', dragEnd);
  });   

  dropCell.addEventListener('dragenter', dragEnter);
  dropCell.addEventListener('dragleave', dragLeave);
  dropCell.addEventListener('dragover', dragOver);
  dropCell.addEventListener('drop', dragDrop);
}

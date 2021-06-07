const fifteen = {
  Move: {up: -4, left: -1, down: 4, right: 1},
  order: [ ...Array(16) ].map((_, i) => i = {id: i+1, data: i}),
  hole: 15,
  /* isCompleted: function() {
    return !this.order.some(function(item, i) {
      return item > 0 && item-1 !== i; 
    }); 
  }, */
  go: function(move) {
    let index = this.hole + move;
    if (!this.order[index]) return false;
    if (move === this.Move.left || move === this.Move.right)
      if (Math.floor(this.hole/4) !== Math.floor(index/4)) return false;
    this.swap(index, this.hole);
    this.hole = index;
    return true; 
  },
  swap: function(i1, i2) { 
    let t = this.order[i1]; 
    this.order[i1] = this.order[i2]; 
    this.order[i2] = t; 
  },
};

let image = new Image();

const importImage = document.body.appendChild(document.createElement('input'));
importImage.type = "file";
importImage.id = 'inputFile';
importImage.onchange = startGame;

async function inputFile() {
  return new Promise((resolve, reject) => {
    let file = document.querySelector('#inputFile').files[0];
    let reader = new FileReader();
  
    reader.onload = function() {
      image.src =  reader.result;
      image.onload = function() {
        console.log(this.width);
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
    console.log(fifteen.order)
    cutImageUp(image);
    draw();
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
} 


const box = document.body.appendChild(document.createElement('div'));
box.setAttribute("id", "box");
box.setAttribute("style", "margin-top: 20px; width: 456px; border: solid 1px transparent;");
for (let i = 0; i < 16; i++) {
  let outDiv = box.appendChild(document.createElement('div'));
  outDiv.setAttribute("class", "outerDiv");
  outDiv.setAttribute("style", "display: inline-block; width: 100px; height: 100px; border: solid 2px gray; margin: 5px; text-align: center; background-color: whitesmoke;");
  let inDiv = outDiv.appendChild(document.createElement('div'));
  inDiv.setAttribute("class", "innerDiv");
};



window.addEventListener('keydown', function(e) {
  if (fifteen.go(fifteen.Move[{37: 'left', 39: 'right', 38: 'up', 40: 'down'}[e.keyCode]])) {
      draw(); 
      if (fifteen.isCompleted()) {
        box.style.backgroundColor = "gold";
        window.removeEventListener('keydown', arguments.callee); 
      }
  }
});


function draw() {
  let boxWidth = image.width + 60;
  box.style.width = boxWidth + "px";
  let n = document.querySelector('div.outerDiv');
  let tile = document.querySelectorAll('div.innerDiv');
  tile.forEach(el => {
    let i = 0;
    el.textContent = fifteen.order[i].id;
    el.style.backgroundImage = `url('${fifteen.order[i].data}')`;
    el.style.width = image.width/4 + "px";
    el.style.height = image.height/4 + "px";
    i++;
  });
}

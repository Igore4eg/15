const fifteen = {
  Move: {up: -4, left: -1, down: 4, right: 1},
  order: [ ...[ ...Array(15) ].map((_, i) => i+1), 0 ],
  hole: 15,
  isCompleted: function() {
    return !this.order.some(function(item, i) {
      return item > 0 && item-1 !== i; 
    }); 
  },
  go: function(move) {
    let index = this.hole + move;
    if (!this.order[index]) return false;
    if (move === this.Move.left || move === this.Move.right)
      if (Math.floor(this.hole/4) !== Math.floor(index/4)) return false;
    this.swap(index, this.hole);
    this.hole = index;
    return true; },
  swap: function(i1, i2) { let t = this.order[i1]; this.order[i1] = this.order[i2]; this.order[i2] = t; },
};



const importImage = document.body.appendChild(document.createElement('input'));
importImage.type = "file";
importImage.id = 'inputFile';

let file    = document.querySelector('#inputFile').files[0];
let reader  = new FileReader();

let image = new Image();
image.onloadend = fifteen.cutImageUp(order);
image.src = reader.result;


function cutImageUp(array) {
    for(let x = 0; x < 4; ++x) {
        for(let y = 0; y < 4; ++y) {
            let canvas = document.createElement('canvas');
            canvas.width = widthOfOnePiece/4;
            canvas.height = heightOfOnePiece/4;
            let context = canvas.getContext('2d');
            context.drawImage(image, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);
            for(let i =0; i<16; i++){
              array[i] = canvas.toDataURL();
            }
          }
    }

} 


/* 
const box = document.body.appendChild(document.createElement('div'));
  for (let i = 0; i < 16; i++) {
    box.appendChild(document.createElement('div'))
  };


window.addEventListener('keydown', function(e) {
  if (fifteen.go(fifteen.Move[{37: 'left', 39: 'right', 38: 'up', 40: 'down'}[e.keyCode]])) {
      draw(); if (fifteen.isCompleted()) {
        box.style.backgroundColor = "gold";
        window.removeEventListener('keydown', arguments.callee); 
      }
  }
});

draw();

function draw() {
  for (var i = 0, tile; tile = box.childNodes[i], i < 16; i++) { 
    tile.textContent = fifteen.order[i];
    tile.style.backgroundImage = 'url(img/' + fifteen.order[i] + '.jpg)';
    tile.style.visibility = fifteen.order[i] ? 'visible' : 'hidden';
  } 
}
 */
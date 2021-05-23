const fifteen = {
  Move: {up: -4, left: -1, down: 4, right: 1},
  order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]./*sort(function() { return Math.random()-.5; }).*/concat(0),
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
  shuffle: function(){
}
};



const importImage = document.body.appendChild(document.createElement('input'));
importImage.type = "file";
importImage.value = "Download";
importImage.id = "input";
importImage.addEventListener("click", handleFiles);
function handleFiles(importImage) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    if (!file.type.startsWith('image/')){ continue }

    var img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;
    preview.appendChild(img); // Предполагается, что "preview" это div, в котором будет отображаться содержимое.

    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
  }
}


const box = document.body.appendChild(document.createElement('div'));
  for (let i = 0; i < 16; i++) {
    box.appendChild(document.createElement('div'))
  };


window.addEventListener('keydown', function(e) {
  if (fifteen.go(fifteen.Move[{39: 'left', 37: 'right', 40: 'up', 38: 'down'}[e.keyCode]])) {
      draw(); 
      if (fifteen.isCompleted()) {
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

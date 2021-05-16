  // Строим модель.
  var fifteen = {
    // Направления движения, можно совместить с кодами клавиш. Но это модель, она ничего не должна знать о внешнем мире.
    Move: {up: -4, left: -1, down: 4, right: 1},
    // Массив чисел, отсортированный в случайном порядке, добавлям 0 последним элементов.
    order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].sort(function() { return Math.random()-.5; }).concat(0),
    // Расположение дырки
    hole: 15,
    // Проверка на собранность
    isCompleted: function() { return !this.order.some(function(item, i) { return item > 0 && item-1 !== i; }); },
    // Ход
    go: function(move) {
      var index = this.hole + move;
      if (!this.order[index]) return false;
      // не всякое движение вправо-влево допустимо
      if (move === this.Move.left || move === this.Move.right)
        if (Math.floor(this.hole/4) !== Math.floor(index/4)) return false;
      this.swap(index, this.hole);
      this.hole = index;
      return true; },
    // перестановка ячеек
    swap: function(i1, i2) { var t = this.order[i1]; this.order[i1] = this.order[i2]; this.order[i2] = t; },
    // проверка на решаемость
    solvable: function(a) {
      for (var kDisorder = 0, i = 1, len = a.length-1; i < len; i++)
        for (var j = i-1; j >= 0; j--) if (a[j] > a[i]) kDisorder++;
      return !(kDisorder % 2); } };

  // Если пазл нерешаемый, делаем его решаемым.
  if (!fifteen.solvable(fifteen.order)) fifteen.swap(0, 1);

  // Создаем видимые элементы
  var box = document.body.appendChild(document.createElement('div'));
  for (var i = 0; i < 16; i++) box.appendChild(document.createElement('div'));

  // Обрабатываем нажатия кнопок
  window.addEventListener('keydown', function(e) {
    if (fifteen.go(fifteen.Move[{39: 'left', 37: 'right', 40: 'up', 38: 'down'}[e.keyCode]])) {
      draw(); if (fifteen.isCompleted()) {
        box.style.backgroundColor = "gold";
        window.removeEventListener('keydown', arguments.callee); } }});

  // Рисуем пятнашки
  draw();
  function draw() {
    for (var i = 0, tile; tile = box.childNodes[i], i < 16; i++) { tile.textContent = fifteen.order[i];
      tile.style.visibility = fifteen.order[i] ? 'visible' : 'hidden';} }

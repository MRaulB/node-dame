var myPieces = [];
var selectedPiece;
var king1;
var king2;
var API_URL = {
  CREATE: '/users',
  READ: '/users',
};

var API_METHOD = {
  READ: 'GET',
  CREATE: 'POST'
};

if (location.host === "mraulb.github.io") {
  API_URL.READ = 'data/board-short.json';
  API_METHOD.READ = 'GET';
  API_METHOD.CREATE = 'POST';
};

/// aranjarea pieselor pe tabla

const Dame = {
  load: () => {
    fetch(API_URL.READ)
      .then(function (resp) {
        return resp.json();
      })
      .then(function (response) {
        var rawPieces = response[0].piese;
        var pieces = typeof rawPieces === 'object' ? rawPieces : JSON.parse(rawPieces);
        myPieces = pieces;
        Dame.display(pieces);
      })
      .catch(e => {
        console.log(e);
      });
  },
  display: function (pieces) {
    paintEmptyTable();
    pieces.forEach(p => {
      var square = document.querySelector(`.p${p.x}-${p.y}`);
      //square.classList.add(`piece${p.piece}`)/// din json am mers in adancime si am adus proprietatea pieces
      square.innerHTML = `<div data-color="${p.piece}" class="piece piece${p.piece}"></div>`

    });
  }
}

Dame.load();

const paintEmptyTable = () => {
  $("#board").html('');
  for (var i = 1; i <= 8; i++) {
    divRow = $("<div>", {
      class: "row",
    });
    for (var j = 1; j <= 8; j++) {
      var div = $(`<div data-x="${i}" data-y="${j}" class="square p${i}-${j}">`);

      if (i % 2 == j % 2) {
        $(div).addClass("white");
      } else {
        $(div).addClass("black");
      }
      divRow.append(div);

    }
    $("#board").append(divRow);
  }

}


//document.querySelector('#board')=$("#board")..sunt acelasi lucru

function clickedOnSquare(x, y) {
  if ((x + y) % 2 === 0) {
    console.log('invalid move', x, y, x + y);
    return;
  }
  var piece = findPiece(x, y);

  console.log('selectedPiece', x, y, piece)

  if (piece) {
    selectedPiece = piece;

    return;
  }
  if (selectedPiece) {
    //move
    tryToMove(selectedPiece, x, y);
  }
}

function findPiece(x, y) {
  return myPieces.find(function (p) {
    return p.x == x && p.y == y;
  });
}


function tryToMove(piece, x, y) {
  console.info('moved', piece, 'to', x, y);

  if (piece.piece == 1) {
    if (piece.x + 1 == x && (piece.y - 1 == y || piece.y + 1 == y)) {


      movePiece(piece, x, y);

    } else if (piece.x + 1 == 8) {
      //coditie ca piesa sa devina king
      piece.piece = king1;
      console.log('king', king1, x, y);
      movePiece(piece, x, y);
    }
    else if (piece.x + 2 == x) {

      var opozitePiece = findPiece(x - 1, y - (y - piece.y) / 2);
      if (opozitePiece && opozitePiece.piece != piece.piece) {
        removePiece(opozitePiece);
        movePiece(piece, x, y);

      }


    }
  } else if (piece.piece == 2) {
    if (piece.x - 1 == x && (piece.y - 1 == y || piece.y + 1 == y)) {
      movePiece(piece, x, y);
    } else if (piece.x - 2 == x) {
      var opozitePiece = findPiece(x + 1, y - (y - piece.y) / 2);
      if (opozitePiece && opozitePiece.piece != piece.piece) {
        removePiece(opozitePiece);
        movePiece(piece, x, y);
      }
    }
    //TODO pt a folosi logica jocului cand piesa evine dama
  } else {









  }
}

function removePiece(piece) {
  console.info('mancam piece', piece);
  myPieces = myPieces.filter(p => p !== piece);
}

function movePiece(piece, x, y) {
  piece.x = x;
  piece.y = y;
  Dame.display(myPieces);
  selectedPiece = undefined;

}

document.querySelector('#board').addEventListener('click', function (e) {
  var square = e.target;
  if (e.target.className.indexOf('piece') > -1) {
    square = e.target.parentNode; ///am verificat daca parintele lui e.target ii square
  }

  const x = square.getAttribute('data-x') * 1;
  const y = square.getAttribute('data-y') * 1;

  clickedOnSquare(x, y);
  return;




})

//Json.parse -converteste un string in obiect array



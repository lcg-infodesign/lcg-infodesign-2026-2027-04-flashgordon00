let cars = [];
let ready = false;
let error = false;

let colors = {
  Volkswagen: [35, 95, 190],
  BMW: [65, 165, 220],
  Mercedes: [235, 180, 45],
  Audi: [220, 65, 65],
  Opel: [120, 95, 190]
};


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");

  loadCars();
}


// carica i dti
async function loadCars() {

  try {

    let response = await fetch("cars.csv");

    if (!response.ok) {
      throw new Error("csv non trovato");
    }

    let text = await response.text();

    let rows = text
      .trim()
      .split(/\r?\n/)
      .slice(1);


    cars = rows.map(row => {

      let v = row.split(",");

      return {
        brand: v[0].trim(),
        model: v[1].trim(),
        sales: Number(v[2]),
        brandShare: Number(v[3]),
        rank: Number(v[4])
      };

    });


    ready = true;

  } catch (e) {

    error = true;
  }
}


function draw() {

  background(246, 244, 238);


  // titolo princpale
  fill(18);

  textAlign(LEFT, TOP);

  textStyle(BOLD);

  textSize(54);

  text(
    "GERMAN CARS",
    55,
    38
  );


  fill(90);

  textStyle(NORMAL);

  textSize(13);

  text(
    "NEW REGISTRATIONS IN GERMANY — 2025",
    58,
    104
  );


  if (error) {

    text(
      "errore nel caricamento di cars.csv",
      58,
      160
    );

    return;
  }


  if (!ready) {

    text(
      "loading data...",
      58,
      160
    );

    return;
  }


  let cols = 6;

  let rows =
    ceil(cars.length / cols);


  let cellW =
    (width - 110) / cols;


  let cellH =
    (height - 210) / rows;


  for (let i = 0; i < cars.length; i++) {

    let col =
      i % cols;


    let row =
      floor(i / cols);


    let x =
      55 +
      cellW / 2 +
      col * cellW;


    let y =
      155 +
      cellH / 2 +
      row * cellH;


    drawCar(
      cars[i],
      x,
      y,
      cellW,
      cellH
    );
  }


  // legenda soto
  fill(90);

  textAlign(LEFT, BOTTOM);

  textSize(10);

  text(
    "SIZE = REGISTRATIONS  ·  COLOR = BRAND  ·  CLICK = DETAIL",
    55,
    height - 22
  );


  textAlign(RIGHT, BOTTOM);

  text(
    "SOURCE: KBA · 2025",
    width - 55,
    height - 22
  );
}


// disegna una macchna
function drawCar(
  car,
  x,
  y,
  cellW,
  cellH
) {

  let size =
    carSize(
      car,
      cellW,
      cellH
    );


  let c =
    colors[car.brand];


  if (
    dist(
      mouseX,
      mouseY,
      x,
      y
    ) < size / 2
  ) {

    size += 7;
  }


  noStroke();

  fill(
    c[0],
    c[1],
    c[2]
  );

  circle(
    x,
    y - 8,
    size
  );


  fill(18);

  textAlign(CENTER, TOP);

  textStyle(BOLD);

  textSize(11);

  text(
    car.model.toUpperCase(),
    x,
    y + size / 2 + 4
  );


  fill(105);

  textStyle(NORMAL);

  textSize(9);

  text(
    car.brand,
    x,
    y + size / 2 + 19
  );
}


// dimenzione dal dato
function carSize(
  car,
  cellW,
  cellH
) {

  let maxSize =
    min(
      cellW,
      cellH
    ) * 0.58;


  return map(
    car.sales,
    19000,
    85000,
    maxSize * 0.45,
    maxSize
  );
}


// click sul modeloo
function mousePressed() {

  if (!ready) return;


  let cols = 6;

  let rows =
    ceil(cars.length / cols);


  let cellW =
    (width - 110) / cols;


  let cellH =
    (height - 210) / rows;


  for (let i = 0; i < cars.length; i++) {

    let col =
      i % cols;


    let row =
      floor(i / cols);


    let x =
      55 +
      cellW / 2 +
      col * cellW;


    let y =
      155 +
      cellH / 2 +
      row * cellH;


    let size =
      carSize(
        cars[i],
        cellW,
        cellH
      );


    if (
      dist(
        mouseX,
        mouseY,
        x,
        y - 8
      ) < size / 2
    ) {

      window.location.href =
        "detail.html?model=" +
        encodeURIComponent(
          cars[i].model
        );

      return;
    }
  }
}


function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}
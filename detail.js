let cars = [];
let car;

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

  createCanvas(
    windowWidth,
    windowHeight
  );

  textFont("Arial");

  loadCars();
}


// filtra il modeloo
async function loadCars() {

  try {

    let response =
      await fetch("cars.csv");


    if (!response.ok) {
      throw new Error();
    }


    let text =
      await response.text();


    let rows =
      text
        .trim()
        .split(/\r?\n/)
        .slice(1);


    cars = rows.map(row => {

      let v =
        row.split(",");


      return {

        brand:
          v[0].trim(),

        model:
          v[1].trim(),

        sales:
          Number(v[2]),

        brandShare:
          Number(v[3]),

        rank:
          Number(v[4])
      };
    });


    let model =
      new URLSearchParams(
        window.location.search
      ).get("model");


    car =
      cars.find(
        c => c.model == model
      );


    if (!car) {
      throw new Error();
    }


    ready = true;

  } catch (e) {

    error = true;
  }
}


function draw() {

  background(
    246,
    244,
    238
  );


  if (error) {

    fill(18);

    textSize(18);

    text(
      "errore nel caricamento del dettaglio",
      55,
      60
    );

    return;
  }


  if (!ready) {

    fill(18);

    textSize(18);

    text(
      "loading data...",
      55,
      60
    );

    return;
  }


  let c =
    colors[car.brand];


  let marketShare =
    car.sales /
    2857591 *
    100;


  // titolo
  fill(18);

  textAlign(LEFT, TOP);

  textStyle(BOLD);

  textSize(54);

  text(
    car.model.toUpperCase(),
    55,
    38
  );


  fill(90);

  textStyle(NORMAL);

  textSize(13);

  text(
    car.brand.toUpperCase() +
    " · GERMANY 2025",
    58,
    104
  );


  // torna indieto
  fill(18);

  rect(
    55,
    138,
    92,
    30,
    15
  );


  fill(255);

  textAlign(CENTER, CENTER);

  textStyle(BOLD);

  textSize(10);

  text(
    "← BACK",
    101,
    153
  );


  let x =
    width * 0.36;


  let y =
    height * 0.56;


  let size =
    map(
      car.sales,
      19000,
      85000,
      190,
      350
    );


  // glifo princpale
  noStroke();

  fill(
    c[0],
    c[1],
    c[2]
  );

  circle(
    x,
    y,
    size
  );


  // quota della marca
  noFill();

  stroke(18);

  strokeWeight(11);


  let angle =
    map(
      car.brandShare,
      0,
      40,
      0,
      TWO_PI
    );


  arc(
    x,
    y,
    size + 32,
    size + 32,
    -HALF_PI,
    -HALF_PI + angle
  );


  noStroke();


  // ranking
  fill(255);

  textAlign(CENTER, CENTER);

  textStyle(BOLD);

  textSize(48);

  text(
    "#" + car.rank,
    x,
    y
  );


  let tx =
    width * 0.64;


  let ty =
    height * 0.31;


  drawValue(
    tx,
    ty,
    "REGISTRATIONS",
    car.sales.toLocaleString("it-IT")
  );


  drawValue(
    tx,
    ty + 105,
    "SHARE OF BRAND",
    car.brandShare.toFixed(1) + "%"
  );


  drawValue(
    tx,
    ty + 210,
    "MARKET SHARE",
    marketShare.toFixed(2) + "%"
  );


  // barra mercato
  fill(215);

  rect(
    tx,
    ty + 288,
    260,
    8
  );


  fill(
    c[0],
    c[1],
    c[2]
  );


  rect(
    tx,
    ty + 288,
    map(
      marketShare,
      0,
      3,
      0,
      260
    ),
    8
  );


  // legenda soto
  fill(90);

  textAlign(LEFT, BOTTOM);

  textStyle(NORMAL);

  textSize(10);


  text(
    "CIRCLE SIZE = REGISTRATIONS  ·  ARC = SHARE OF BRAND  ·  NUMBER = RANK",
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


// testi dei dti
function drawValue(
  x,
  y,
  label,
  value
) {

  fill(95);

  textAlign(LEFT, TOP);

  textStyle(BOLD);

  textSize(10);

  text(
    label,
    x,
    y
  );


  fill(18);

  textSize(30);

  text(
    value,
    x,
    y + 22
  );
}


function mousePressed() {

  if (
    mouseX > 55 &&
    mouseX < 147 &&
    mouseY > 138 &&
    mouseY < 168
  ) {

    window.location.href =
      "index.html";
  }
}


function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}
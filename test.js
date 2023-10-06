let myKey = {};

document.addEventListener("keydown", function (event) {
  myKey[event.key] = true;
  backchange();
});

document.addEventListener("keyup", function (event) {
  myKey[event.key] = false;
  backchange();
});

function backchange() {
  backbottomDIV.className = "back-bottom"; // Clear existing classes
  if (myKey["q"]) {
    if (hit) {
      console.log("q");
      backbottomDIV.classList.add("backq");
    } else {
      console.log("qf");
      backbottomDIV.classList.add("backqf");
    }
  }
  if (myKey["s"]) {
    if (hit) {
      console.log("s");
      backbottomDIV.classList.add("backs");
    } else {
      console.log("sf");
      backbottomDIV.classList.add("backsf");
    }
  }
  if (myKey["l"]) {
    if (hit) {
      console.log("l");
      backbottomDIV.classList.add("backl");
    } else {
      console.log("lf");
      backbottomDIV.classList.add("backlf");
    }
  }
  if (myKey["m"]) {
    if (hit) {
      console.log("m");
      backbottomDIV.classList.add("backm");
    } else {
      console.log("mf");
      backbottomDIV.classList.add("backmf");
    }
  }
}

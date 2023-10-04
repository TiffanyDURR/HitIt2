function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    for (let key in keys) {
      let hitzone = keys[key];
      ctx.fillStyle = "rgba(236, 8, 83, 0)";
      ctx.fillRect(hitzone.x, hitzone.y, 110, 110);
    }
  
    for (let i = 0; i < circles.length; i++) {
      let circle = circles[i];
      let keyInfo = keys[circle.key];
      circle.y += speed; // Vitesse
      ctx.beginPath();
      ctx.arc(keyInfo.x + 55, circle.y, 25, 0, Math.PI * 2);
  
      /* ctx.fillStyle = keyInfo.color; */
      /* ctx.fill(); */
  
      ctx.drawImage(keyInfo.image, keyInfo.x + 55 - 25, circle.y - 25, 50, 50);
  
      if (circle.y > canvas.height) {
        circles.splice(i, 1);
        i--;
      }
    }
  
    requestAnimationFrame(draw);
  }

  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let key in keys) {
      let hitzone = keys[key];
      ctx.fillStyle = "rgba(236, 8, 83, 0)";
      ctx.fillRect(hitzone.x, hitzone.y, 110, 110);
    }
  
    for (let i = 0; i < circles.length; i++) {
      let circle = circles[i];
      let keyInfo = keys[circle.key];
      circle.y += 6;
      ctx.beginPath();
      ctx.arc(keyInfo.x + 55, circle.y, 25, 0, Math.PI * 2);
      ctx.drawImage(keyInfo.image, keyInfo.x + 55 - 25, circle.y - 25, 50, 50);
  
      if (circle.y > canvas.height) {
        // Fail
        combo = 0;
        console.log(combo + "!!!");
        points = 0;
        multiplier = 1;
        console.log(multiplier + "!!!");
        score += 0;
        lives--;
        console.log(lives + "!!!");
        circles.splice(i, 1);
        i--;
      }
    }
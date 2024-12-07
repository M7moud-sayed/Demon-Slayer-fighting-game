class Fighter extends Sprite {
  constructor({
    possition,
    velocity,
    color = "red",
    imgSrc,
    scale = 1,
    framesMax = 1,
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
    offset = { x: 0, y: 0 },
  }) {
    super({
      possition,
      imgSrc,
      scale,
      framesMax,
      offset,
    });
    this.possition = possition;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.color = color;
    this.isAttacking = false;
    this.isBlocking = false; // حالة الدفاع
    this.attackBox = {
      possition: {
        x: this.possition.x,
        y: this.possition.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.health = 100;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 17;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].img = new Image();
      sprites[sprite].img.src = sprites[sprite].imgSrc;
    }
    console.log(this.sprites);
  }

  block() {
    if (!this.isBlocking) { // التأكد من أن اللاعب ليس في حالة دفاع بالفعل
      this.switchSprite("block");
      this.isBlocking = true;

      // إيقاف الدفاع بعد 500ms
      setTimeout(() => {
        this.isBlocking = false;
        this.switchSprite("idle"); // العودة إلى الوضع الأساسي
      }, 500);
    }
  }

  update() {
    this.drow();
    if (!this.dead) this.animateFrames();

    // تحديث موقع مربع الهجوم
    this.attackBox.possition.x = this.possition.x + this.attackBox.offset.x;
    this.attackBox.possition.y = this.possition.y + this.attackBox.offset.y;

    // تطبيق الجاذبية
    this.possition.y += this.velocity.y;
    this.possition.x += this.velocity.x;

    if (
      this.possition.y + this.height + this.velocity.y >=
      canvas.height - 70
    ) {
      this.velocity.y = 0;
      this.possition.y = 356;
    } else this.velocity.y += gravity;
  }

  switchSprite(sprite) {
    if (this.img === this.sprites.death.img) {
      if (this.currentFrame === this.sprites.death.framesMax - 1) {
        this.dead = true;
      }
      return;
    }

    if (this.img === this.sprites.block.img && this.isBlocking) return;

    switch (sprite) {
      case "idle":
        if (this.img !== this.sprites.idle.img) {
          this.img = this.sprites.idle.img;
          this.framesMax = this.sprites.idle.framesMax;
          this.currentFrame = 0;
        }
        break;
      case "block":
        if (this.img !== this.sprites.block.img) {
          this.img = this.sprites.block.img;
          this.framesMax = this.sprites.block.framesMax;
          this.framesHold = this.sprites.block.framesHold || 5;
          this.currentFrame = 0;
        }
        break;
    }
    const player = new Fighter({
      possition: { x: 100, y: 0 },
      velocity: { x: 0, y: 0 },
      imgSrc: 'idle.png',
      scale: 1,
      framesMax: 10,
      sprites: {
        idle: { imgSrc: 'idle.png', framesMax: 10 },
        block: { imgSrc: 'block.png', framesMax: 5 }, 
      },
      attackBox: { offset: { x: 50, y: 50 }, width: 100, height: 50 },
    });
    
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Shift":  
          player.block();
          break;
      }
    });
    
  }
  
}

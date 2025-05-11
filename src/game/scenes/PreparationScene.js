export class PreparationScene extends Phaser.Scene {
  constructor() {
    super("PreparationScene");
  }
  preload(){
    this.load.audio('prepar','music/prepar.mp3')
    this.load.audio("klik",'music/klik.wav')
    this.load.image("1", "assets/paru_.jpeg");
    this.load.image("2", "assets/logo.png");
  }

  create() {
    this.sound.play('prepar', {
        loop: true, // Menentukan agar backsound diputar berulang
        volume: 0.5 // Menentukan volume (0.0 hingga 1.0)
    });
    const clickSound = this.sound.add('klik');
    
    const width = this.scale.width;
    const height = this.scale.height;

    const slides = ['1', '2'];
    let currentIndex = 0;

    const currentImage = this.add
    .image(width / 2, height / 2, slides[currentIndex])
    .setDisplaySize(width * 0.6, height * 0.6)
    .setOrigin(0.5);

  // Fungsi untuk update gambar saat tombol ditekan
  const updateSlide = (direction) => {
    if (direction === 'left') {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    } else if (direction === 'right') {
      currentIndex = (currentIndex + 1) % slides.length;
    }
    currentImage.setTexture(slides[currentIndex]);
  };

    // Title
    this.add
      .text(width / 2, height * 0.1, "Preparation Time", {
        fontFamily: "Arial",
        fontSize: `${Math.floor(height * 0.045)}px`,
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

      this.add
  .text(width / 2, height * 0.15, "Review the material before starting", {
    fontFamily: "Arial",
    fontSize: `${Math.floor(height * 0.025)}px`,
    color: "#ffffff",
  })
  .setOrigin(0.5);

    // Content Box
    const boxWidth = width * 0.65;
    const boxHeight = height * 0.6;
    
    // this.add.rectangle(width / 2, height / 2, boxWidth, boxHeight, 0xdddddd);
    
    // // Sesuaikan ukuran font berdasarkan tinggi kotak
    // const fontSize = Math.floor(boxHeight * 0.15); // 15% dari tinggi kotak
    
    // this.add
    //   .text(width / 2, height / 2, "content ppt", {
    //     fontFamily: "Arial",
    //     fontSize: `${fontSize}px`,
    //     color: "#000000",
    //     align: "center",
    //     wordWrap: { width: boxWidth * 0.9 }, // bungkus teks jika kepanjangan
    //   })
    //   .setOrigin(0.5);
    

    // Arrow Buttons
    const arrowSize = height * 0.05;

    // Tombol kiri
    const leftBtn = this.add
      .rectangle(width * 0.1, height / 2, arrowSize, arrowSize, 0xf97316)
      .setInteractive();
    this.add
      .text(width * 0.1, height / 2, "<", {
        fontSize: `${arrowSize * 0.6}px`,
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Tombol kanan
    const rightBtn = this.add
      .rectangle(width * 0.9, height / 2, arrowSize, arrowSize, 0xf97316)
      .setInteractive();
    this.add
      .text(width * 0.9, height / 2, ">", {
        fontSize: `${arrowSize * 0.6}px`,
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Mengubah cursor menjadi pointer saat mouse berada di atas tombol kiri
    leftBtn.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
    });

    // Mengembalikan cursor ke default saat mouse meninggalkan tombol kiri
    leftBtn.on("pointerout", () => {
      this.input.setDefaultCursor("default");
    });
    leftBtn.on("pointerdown", () => {
        clickSound.play()
        updateSlide('left');
    //   this.scene.start("Puzzle");
    });

    // Mengubah cursor menjadi pointer saat mouse berada di atas tombol kanan
    rightBtn.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
    });

    // Mengembalikan cursor ke default saat mouse meninggalkan tombol kanan
    rightBtn.on("pointerout", () => {
      this.input.setDefaultCursor("default");
    });

    rightBtn.on("pointerdown", () => {
        clickSound.play()
        updateSlide('right');
    //   this.scene.start("Puzzle");
    });

    // Play Button
    const playBtn = this.add
      .rectangle(width / 2, height * 0.85, width * 0.2, height * 0.07, 0xf97316)
      .setInteractive();

    this.add
      .text(width / 2, height * 0.85, "Play", {
        fontSize: `${height * 0.03}px`,
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Mengubah cursor menjadi pointer saat mouse berada di atas tombol
    playBtn.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
    });

    // Mengembalikan cursor ke default saat mouse meninggalkan tombol
    playBtn.on("pointerout", () => {
      this.input.setDefaultCursor("default");
    });

    playBtn.on("pointerdown", () => {
        clickSound.play()
        this.sound.stopByKey('prepar')
      this.scene.start("Puzzle");
    });
  }
}

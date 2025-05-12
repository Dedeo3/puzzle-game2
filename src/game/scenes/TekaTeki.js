import { Scene } from "phaser";

export class TekaTeki extends Scene {
    constructor() {
        super("TekaTeki");
    }

    preload() {
        this.load.audio("tk", "music/tk.mp3");
        this.load.image("bg", "assets/bgT.jpg");
    }

    init() {
        this.selectedCell = null;
        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;

        const rows = 16;
        const cols = 15;
        this.answerKey = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => '')
        );

       this.daftarkata = [
    {
        no: 1,
        kata: 'ANEMIA',
        petunjuk: 'Penderita yang biasanya merasa lemah, mudah letih, dan wajahnya pucat',
        row: 0,
        col: 6,
        arah: 'MENURUN'
    },
    {
        no: 2,
        kata: 'JANTUNGKOLONER',
        petunjuk: 'Penyakit yang disebabkan karena tersumbatnya aliran darah ke jantung',
        row: 1,
        col: 1,
        arah: 'MENDATAR'
    },
    {
        no: 3,
        kata: 'TRANSFUSIDARAH',
        petunjuk: 'Pemberian darah dari satu orang ke orang lain',
        row: 1,
        col: 4,
        arah: 'MENURUN'
    },
    {
        no: 4,
        kata: 'PLASMADARAH',
        petunjuk: 'Cairan berwarna kuning keruh yang mengandung sari makanan',
        row: 3,
        col: 2,
        arah: 'MENDATAR'
    },
    {
        no: 5,
        kata: 'KEPINGDARAH',
        petunjuk: 'Sel darah yang berperan dalam pembekuan darah',
        row: 5,
        col: 0,
        arah: 'MENURUN'
    },
    {
        no: 6,
        kata: 'BILIKKANAN',
        petunjuk: 'Bagian jantung yang memompa darah ke paru - paru',
        row: 6,
        col: 11,
        arah: 'MENURUN'
    },
    {
        no: 7,
        kata: 'PEMBULUHKAPILER',
        petunjuk: 'Pembuluh yang menghubungkan pembuluh nadi dan pembuluh balik',
        row: 7,
        col: 0,
        arah: 'MENDATAR'
    },
    {
        no: 8,
        kata: 'ERITROSIT',
        petunjuk: 'Bagian darah yang berfungsi mengangkut sari - sari makanan',
        row: 7,
        col: 13,
        arah: 'MENURUN'
    },
    {
        no: 9,
        kata: 'GINJAL',
        petunjuk: 'Organ yang berperan dalam mengatur tekanan darah, produksi sel darah merah dan kadar elektrolit',
        row: 9,
        col: 3,
        arah: 'MENDATAR'
    },
    {
        no: 10,
        kata: 'AORTA',
        petunjuk: 'Pembuluh nadi terbesar keluar dari bilik kiri ke jantung',
        row: 13,
        col: 4,
        arah: 'MENDATAR'
    },
];


        this.daftarkata.forEach(item => {
            const { kata, row, col, arah } = item;
            for (let i = 0; i < kata.length; i++) {
                const r = arah === 'MENURUN' ? row + i : row;
                const c = arah === 'MENURUN' ? col : col + i;
                if (r < rows && c < cols) {
                    this.answerKey[r][c] = kata[i].toUpperCase();
                }
            }
        });

        this.answers = this.answerKey.map(row => row.map(cell => cell.toUpperCase()));
        this.grid = [];
        this.hasChecked = false;
    }

    create() {
        const { gameWidth, gameHeight } = this;

        // Tambahkan gambar background dan sesuaikan ukurannya
        this.add.image(gameWidth / 2, gameHeight / 2, "bg")
            .setDisplaySize(gameWidth, gameHeight)
            .setDepth(-1);

        this.createHeader();
        this.sound.play("tk", { loop: true, volume: 0.3 });

        const cellSize = 36;
        const rows = this.answers.length;
        const cols = this.answers[0].length;
        const gridWidth = cols * cellSize;
        const gridHeight = rows * cellSize;

        const gridX = gameWidth / 2 - gridWidth / 2;
        const gridY = 120;

        // Background untuk kotak grid
        this.add.rectangle(gridX - 8, gridY - 8, gridWidth + 16, gridHeight + 16, 0x333333)
            .setOrigin(0);

        const clueNumbers = {};
        this.daftarkata.forEach(k => {
            const r = k.arah === 'MENURUN' ? k.row : k.row;
            const c = k.arah === 'MENURUN' ? k.col : k.col;
            clueNumbers[`${r},${c}`] = k.no;
        });

        this.input.keyboard.on("keydown", (event) => {
            if (!this.selectedCell) return;
            const key = event.key.toUpperCase();

            if (/^[A-Z]$/.test(key)) {
                this.selectedCell.text.setText(key);
                if (this.hasChecked) {
                    this.resetCellColors();
                    this.hasChecked = false;
                }
            } else {
                const { row, col } = this.selectedCell;
                if (event.key === "ArrowRight" && col < cols - 1) this.selectCell(row, col + 1);
                if (event.key === "ArrowLeft" && col > 0) this.selectCell(row, col - 1);
                if (event.key === "ArrowDown" && row < rows - 1) this.selectCell(row + 1, col);
                if (event.key === "ArrowUp" && row > 0) this.selectCell(row - 1, col);
            }
        });

        for (let row = 0; row < rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < cols; col++) {
                const x = gridX + col * cellSize;
                const y = gridY + row * cellSize;
                const isActive = this.answers[row][col] !== '';

                const cellBg = this.add.rectangle(x, y, cellSize - 2, cellSize - 2, isActive ? 0xffffff : 0x888888)
                    .setOrigin(0)
                    .setStrokeStyle(1, 0x000000);

                const letter = this.add.text(x + cellSize / 2, y + cellSize / 2, '', {
                    fontSize: '20px',
                    color: '#000000',
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                }).setOrigin(0.5);

                const cell = { bg: cellBg, text: letter, row, col, isActive };

                if (isActive) {
                    const key = `${row},${col}`;
                    if (clueNumbers[key]) {
                        this.add.text(x + 2, y + 2, clueNumbers[key], {
                            fontSize: '11px',
                            color: '#000000',
                            fontFamily: 'Arial',
                        }).setOrigin(0);
                    }

                    cellBg.setInteractive().on("pointerdown", () => {
                        this.selectCell(row, col);
                    });
                }

                this.grid[row][col] = cell;
            }
        }

        this.createClues(gridX + gridWidth + 20, gridY);
        this.createCheckButton(gameWidth / 2, gridY + gridHeight + 60);
    }

    createHeader() {
        this.add.rectangle(this.gameWidth / 2, 40, 700, 60, 0xffffff)
            .setStrokeStyle(2, 0x000000)
            .setAlpha(0.85)
            .setOrigin(0.5);

        this.add.text(this.gameWidth / 2, 40, "TEKA-TEKI SILANG: SISTEM PEREDARAN DARAH", {
            fontSize: '20px',
            color: '#222222',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    createClues(x, y) {
        const cluesMendatar = [
            { no: 2, text: "Penyakit karena tersumbatnya aliran darah ke jantung" },
            { no: 4, text: "Cairan kuning keruh yang mengandung sari makanan" },
            { no: 7, text: "Pembuluh penghubung pembuluh nadi dan pembuluh balik" },
            { no: 9, text: "Organ pengatur tekanan darah dan produksi sel darah merah" },
            { no: 10, text: "Pembuluh nadi terbesar dari bilik kiri jantung" }
        ];

        const cluesMenurun = [
            { no: 1, text: "Kondisi dengan gejala lemah, letih, dan wajah pucat" },
            { no: 3, text: "Proses pemberian darah ke orang lain" },
            { no: 5, text: "Sel darah untuk pembekuan darah" },
            { no: 6, text: "Bagian jantung yang memompa darah ke paru-paru" },
            { no: 8, text: "Bagian darah yang mengangkut sari-sari makanan" }
        ];

        const titleStyle = {
            font: 'bold 16px Arial',
            fill: '#8B0000',
            padding: { bottom: 10 }
        };

        const clueStyle = {
            font: '14px Arial',
            fill: '#333',
            wordWrap: { 
                width: 280,
                useAdvancedWrap: true
            },
            lineSpacing: 5
        };

        const cluesBg = this.add.rectangle(x - 10, y - 10, 300, 500, 0xffffff)
            .setOrigin(0)
            .setStrokeStyle(1, 0xdddddd)
            .setAlpha(0.9);

        this.add.text(x, y, 'MENDATAR', titleStyle);
        
        let currentY = y + 30;
        cluesMendatar.forEach(item => {
            this.add.text(x, currentY, `${item.no}. ${item.text}`, clueStyle);
            currentY += 35;
        });

        currentY += 20;
        this.add.text(x, currentY, 'MENURUN', titleStyle);
        currentY += 30;
        
        cluesMenurun.forEach(item => {
            this.add.text(x, currentY, `${item.no}. ${item.text}`, clueStyle);
            currentY += 35;
        });
    }

    createCheckButton(x, y) {
        const button = this.add.rectangle(x, y, 160, 45, 0x2196F3)
            .setInteractive()
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x000000);

        this.add.text(x, y, 'Submit', {
            fontSize: '16px',
            color: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        button.on('pointerdown', () => {
            this.checkAnswers();
        });
    }

    checkAnswers() {
        let score = 0;
        this.hasChecked = true;
        this.resetCellColors();

        this.daftarkata.forEach(({ kata, row, col, arah }) => {
            let benar = true;

            for (let i = 0; i < kata.length; i++) {
                const r = arah === 'MENURUN' ? row + i : row;
                const c = arah === 'MENURUN' ? col : col + i;

                const cell = this.grid[r][c];
                const jawabanUser = cell.text.text.toUpperCase();
                const jawabanBenar = kata[i].toUpperCase();

                if (jawabanUser !== jawabanBenar) {
                    benar = false;
                    cell.bg.setFillStyle(0xffcccc); // merah muda jika salah
                } else {
                    cell.bg.setFillStyle(0xccffcc); // hijau muda jika benar
                }
            }

            if (benar) score += 10;
        });

        this.showScoreAlert(score, this);
    }

    resetCellColors() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                const cell = this.grid[row][col];
                if (cell.isActive) {
                    cell.bg.setFillStyle(0xffffff);
                }
            }
        }
    }

    showScoreAlert(score, scene) {
    let message = '';
    let color = 0x28a745; // hijau default
    let iconEmoji = '🎉';

    if (score >= 80) {
        message = `Keren! Skormu ${score} 🎉\nKamu luar biasa!`;
        color = 0x28a745; // hijau
        iconEmoji = '🏆';
    } else if (score >= 60) {
        message = `Bagus! Skormu ${score} ⭐\nTerus tingkatkan ya!`;
        color = 0xffc107; // kuning
        iconEmoji = '💪';
    } else {
        message = `Skormu ${score} 😢\nJangan menyerah, terus semangat!`;
        color = 0xdc3545; // merah
        iconEmoji = '🔥';
    }

    // Background overlay
    const overlay = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, scene.scale.width, scene.scale.height, 0x000000, 0.5);
    overlay.setDepth(1000);

    // Alert box
    const boxWidth = 320;
    const boxHeight = 180;
    const alertBox = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, boxWidth, boxHeight, 0xffffff);
    alertBox.setStrokeStyle(3, color);
    alertBox.setDepth(1001);

    // Emoji Icon
    const icon = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 - 55, iconEmoji, {
        fontSize: '36px'
    }).setOrigin(0.5).setDepth(1002);

    // Message
    const alertText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 - 10, message, {
        fontSize: '16px',
        color: '#000000',
        align: 'center',
        fontFamily: 'Arial',
        wordWrap: { width: boxWidth - 40 }
    }).setOrigin(0.5).setDepth(1002);

    // OK button
    const button = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2 + 55, 90, 30, color);
    button.setInteractive({ useHandCursor: true });
    button.setDepth(1002);

    const buttonText = scene.add.text(button.x, button.y, 'OK', {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Arial'
    }).setOrigin(0.5).setDepth(1003);

    // Destroy all when OK is clicked
    button.on('pointerdown', () => {
        overlay.destroy();
        alertBox.destroy();
        alertText.destroy();
        button.destroy();
        buttonText.destroy();
        icon.destroy();
    });
}


    selectCell(row, col) {
        if (!this.grid[row] || !this.grid[row][col] || !this.grid[row][col].isActive) return;
        if (this.selectedCell) {
            this.selectedCell.bg.setStrokeStyle(1, 0x000000);
        }
        this.selectedCell = this.grid[row][col];
        this.selectedCell.bg.setStrokeStyle(3, 0xff9800); // oranye terang
    }
}

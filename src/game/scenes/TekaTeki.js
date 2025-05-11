import { Scene } from "phaser";

export class TekaTeki extends Scene{
    constructor(){
        super('TekaTeki');
        
    }

    preload(){
        this.load.audio('tk','music/tk.mp3')
    }
    init() {
        this.grid = [];
        this.selectedCell = null;

        // Jawaban TTS: baris 1 kolom 0-3 = KODE
        this.answer = [
            ['', '', '', '', ''],
            ['K', 'O', 'D', 'E', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ];
    }

    create() {
        this.sound.play('tk', {
            loop: true,
            volume: 0.5
          });
        const cellSize = 50;
        const offsetX = 100;
        const offsetY = 100;

        this.input.keyboard.on('keydown', (event) => {
            if (!this.selectedCell) return;
            const key = event.key.toUpperCase();
            if (/^[A-Z]$/.test(key)) {
                this.selectedCell.text.setText(key);
            }
        });

        for (let row = 0; row < 5; row++) {
            this.grid[row] = [];
            for (let col = 0; col < 5; col++) {
                const x = offsetX + col * cellSize;
                const y = offsetY + row * cellSize;
                const isActive = this.answer[row][col] !== '';

                const cellBg = this.add.rectangle(x, y, cellSize - 4, cellSize - 4, isActive ? 0xffffff : 0x666666).setOrigin(0);
                const letter = this.add.text(x + 10, y + 5, '', {
                    fontSize: '24px',
                    color: '#000000',
                    fontFamily: 'monospace'
                });

                const cell = { bg: cellBg, text: letter, row, col };

                if (isActive) {
                    cellBg.setInteractive().on('pointerdown', () => {
                        if (this.selectedCell) {
                            this.selectedCell.bg.setStrokeStyle(0);
                        }
                        this.selectedCell = cell;
                        cell.bg.setStrokeStyle(2, 0xff0000);
                    });
                }

                this.grid[row][col] = cell;
            }
        }

        this.add.text(100, 380, 'Mendatar 1: Bahasa pemrograman untuk membuat game ini', {
            fontSize: '16px',
            fill: '#ffffff'
        });
    }
}
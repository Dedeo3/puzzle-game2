import { Scene } from 'phaser';

export class Home extends Scene {
    constructor() {
        super('Home');
    }
    
    preload(){
        this.load.audio("home",'music/home.mp3')
        this.load.audio("klik",'music/klik.wav')
    }

    create() {
        this.sound.play('home', {
            loop: true, // Menentukan agar backsound diputar berulang
            volume: 0.5 // Menentukan volume (0.0 hingga 1.0)
        });
        const clickSound = this.sound.add('klik');

        const centerX = this.scale.width / 2;
         this.sound.play('home', {
        loop: true, // Menentukan agar backsound diputar berulang
        volume: 0.5 // Menentukan volume (0.0 hingga 1.0)
    });
        const centerY = this.scale.height / 2;

        // Title
        this.add.text(centerX, centerY - 120, 'Welcome To Puzzle Game', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Input field
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = 'Enter Your Name';
        inputElement.style.width = '80%';
        inputElement.style.maxWidth = '300px';
        inputElement.style.height = '35px';
        inputElement.style.fontSize = '16px';
        inputElement.style.textAlign = 'center';
        inputElement.style.borderRadius = '10px';
        inputElement.style.border = 'none';
        inputElement.style.outline = 'none';
        inputElement.style.backgroundColor = '#f5f5f5';

        const input = this.add.dom(centerX, centerY - 30, inputElement);

        // Button
        const buttonElement = document.createElement('button');
        buttonElement.innerText = 'Next';
        buttonElement.style.width = '120px';
        buttonElement.style.height = '40px';
        buttonElement.style.fontSize = '16px';
        buttonElement.style.backgroundColor = '#f97316';
        buttonElement.style.color = 'white';
        buttonElement.style.border = 'none';
        buttonElement.style.borderRadius = '5px';
        buttonElement.style.cursor = 'pointer';

        const button = this.add.dom(centerX, centerY + 30, buttonElement);

        // Error Text (hide by default)
        const errorText = this.add.text(centerX, centerY + 80, '', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ff0000'
        }).setOrigin(0.5);

        // Button event
        buttonElement.addEventListener('click', () => {
            const name = inputElement.value.trim();
            clickSound.play()
            if (name) {
                this.registry.set('playerName', name);
                this.scene.start('PreparationScene');
                this.sound.stopByKey('home')
            } else {
                errorText.setText('Please enter your name');
                this.tweens.add({
                    targets: errorText,
                    alpha: 0,
                    duration: 8000,
                    ease: 'Power2',
                    onComplete: () => {
                        errorText.setAlpha(1);
                        errorText.setText('');
                    }
                });
            }
        });

        // Creator credit
        this.add.text(centerX, this.scale.height - 40, 'Created by: admin', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#dddddd'
        }).setOrigin(0.5);

        // Optional: handle screen resize
        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;
        this.cameras.resize(width, height);
    }
}

// nes-emulator.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('nes-screen');
    const context = canvas.getContext('2d');
    const nes = new NES({
        onFrame: function(frameBuffer) {
            const imageData = context.createImageData(256, 240);
            for (let i = 0; i < frameBuffer.length; i++) {
                const index = i * 4;
                imageData.data[index] = frameBuffer[i] & 0xff;
                imageData.data[index + 1] = (frameBuffer[i] >> 8) & 0xff;
                imageData.data[index + 2] = (frameBuffer[i] >> 16) & 0xff;
                imageData.data[index + 3] = 0xff;
            }
            context.putImageData(imageData, 0, 0);
        },
        onAudioSample: function(left, right) {
            // Handle audio
        }
    });

    document.getElementById('file-input').addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function() {
            const nesData = new Uint8Array(reader.result);
            nes.loadROM(nesData);
            nes.start();
        };
        reader.readAsArrayBuffer(file);
    });

    const buttonMapping = {
        'up': 'UP',
        'down': 'DOWN',
        'left': 'LEFT',
        'right': 'RIGHT',
        'start': 'START',
        'select': 'SELECT',
        'a': 'A',
        'b': 'B'
    };

    Object.keys(buttonMapping).forEach(buttonId => {
        const nesButton = buttonMapping[buttonId];
        const buttonElement = document.getElementById(buttonId);
        buttonElement.addEventListener('mousedown', () => nes.buttonDown(1, NES.BUTTON[nesButton]));
        buttonElement.addEventListener('mouseup', () => nes.buttonUp(1, NES.BUTTON[nesButton]));
    });
});

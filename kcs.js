const fs = require('fs');
const readline = require('readline');
const path = require('path');
var kle = require("@ijprest/kle-serial");

// Eingabe- und Ausgabedateinamen von der Kommandozeile lesen
const [, , inputFileName, outputFileName] = process.argv;

// Funktion zum Einlesen der JSON-Datei
function readJSONFromStdin() {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });

        let inputData = '';

        rl.on('line', (line) => {
            inputData += line;
        });

        rl.on('close', () => {
            try {
                resolve(JSON.parse(inputData));
            } catch (error) {
                reject(error);
            }
        });
    });
}

// Funktion zum Erstellen der HTML-Ausgabe
function createHTML(data) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>JSON to HTML</title>
        <link rel="stylesheet" href="http://www.keyboard-layout-editor.com/css/kb.css">
        <link rel="stylesheet" href="http://www.keyboard-layout-editor.com/css/kbd-webfont.css">
        <link rel="stylesheet" href="http://www.keyboard-layout-editor.com/css/font-awesome.min.css">
        <link rel="stylesheet" href="kcs.css">
      </head>
      <body>
      <div class="keys">
  ` + data.keys.map((key, i) => {
        var layers = ''
        for (index = 0; index < 9; index++) {
            var textsize = key.textSize[index]?key.textSize[index]:3

            if (key.labels[index] && key.labels[index] != 'undefined' && key.labels[index] != '') {
                layers += `<span class="layer layer-${index} textsize-${textsize}" data-key-index="${i}" style="color:${key.textColor[index]}">${key.labels[index]}</span>`
            }
        }
        return `<div class="key" style="color:${key.default.textColor}">${layers}</div>`
    }).join('') + `
     </div> </body>
    </html>
  `;
}

// Hauptfunktion
async function main() {
    try {
        const jsonData = await readJSONFromStdin();
        const htmlContent = createHTML(kle.Serial.deserialize(jsonData));
        console.error(kle.Serial.deserialize(jsonData).keys[36]);

        process.stdout.write(htmlContent);
    } catch (error) {
        console.error(`Fehler beim Verarbeiten der Eingabe: ${error.message}`);
        process.exit(1);
    }
}

// Programm starten
main();

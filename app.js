const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());

const VAULT_PATH = '/home/master/Documents/pruebas01';

app.get('/',(req,res)=>{
    res.json({
        'res':'hola'
    })
})

app.post('/caso/documento', (req, res) => {
    try {
        const {expediente,cliente,titulo,resumen } = req.body;

        const carpetaCaso = path.join(
            VAULT_PATH,
            sanitizarNombre(`${expediente} ${cliente}`)
        );

        fs.mkdirSync(carpetaCaso, { recursive: true });

        const archivo = path.join(
            carpetaCaso,
            `${titulo}.md`
        );

        fs.writeFileSync(
            archivo,
            construirResumen(expediente,resumen)
        );

        res.json({
            success: true
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});



function construirResumen(expediente, resumen) {
    return `[[${expediente}]]\n${resumen}`;
}

// function construirMarkdown(doc) {
//     return `---
// tipo: ${doc.tipo}
// fecha: ${doc.fecha}
// ---

// # ${doc.nombre}

// ## Resumen

// ${doc.resumen}
// `;
// }

function sanitizarNombre(texto) {
    return texto
        .replace(/[^\w\s-]/g, '')
        .trim();
}

app.listen(3002, () => {
    console.log('API iniciada en puerto 3002');
});
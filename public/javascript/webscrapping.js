const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function extraerDatosYGuardarJson(url, nombreArchivo) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const datos = $('tbody tr:has(td:nth-child(4))').map((_, row) => ({
            Nombre: $(row).find('td:nth-child(2)').text().trim(),
            Reputacion: parseInt($(row).find('td:nth-child(4)').text().trim()) || 0
        })).get();

        fs.writeFileSync(nombreArchivo, JSON.stringify(datos, null, 2), 'utf-8');
        console.log(`Datos guardados en ${nombreArchivo}`);
    } catch (error) {
        console.error(`Error al extraer datos: ${error.message}`);
    }
}

async function ejecutarProcesoVariasVeces() {
    const url = 'https://ninjakaizen.com/clan/101';

    for (let i = 0; i < 999; i++) {
        const nombres = ['datos.json', 'newdatos.json'];
        const [nombreArchivoDatos, nombreArchivoNewDatos] = nombres.map(nombre => `${nombre}`);

        await extraerDatosYGuardarJson(url, nombreArchivoDatos);
        console.log(`Ejecución ${i + 1} (${nombreArchivoDatos}) completa.`);

        await new Promise(resolve => setTimeout(resolve, 60000));

        await extraerDatosYGuardarJson(url, nombreArchivoNewDatos);
        console.log(`Ejecución ${i + 1} (${nombreArchivoNewDatos}) completa.`);

        const datos = JSON.parse(fs.readFileSync(nombreArchivoDatos, 'utf-8'));
        const newDatos = JSON.parse(fs.readFileSync(nombreArchivoNewDatos, 'utf-8'));
        const resultadoResta = datos.map((dato, index) => ({
            id: index + 1,
            Nombre: dato.Nombre,
            'ReputacionOriginal': dato.Reputacion,
            'NuevaReputacion': newDatos[index].Reputacion,
            'Diferencia': newDatos[index].Reputacion - dato.Reputacion,
        }));

        fs.writeFileSync('resultado_resta.json', JSON.stringify(resultadoResta, null, 2), 'utf-8');
        console.log('Resultado de la resta guardado en resultado_resta.json');
    }
}

module.exports ={ejecutarProcesoVariasVeces} 
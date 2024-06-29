const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

// Función para extraer datos y guardar en un archivo JSON
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
        throw error; // Propaga el error para manejo superior
    }
}

// Función para ejecutar el proceso de scraping y cálculo de diferencias varias veces
async function ejecutarProcesoVariasVeces2() {
    const url = 'https://ninjakaizen.com/clan/101';

    try {
        for (let i = 0; i < 999; i++) {
            const nombres = ['datos2.json', 'newdatos2.json'];
            const [nombreArchivoDatos, nombreArchivoNewDatos] = nombres.map(nombre => `${nombre}`);

            await extraerDatosYGuardarJson(url, nombreArchivoDatos);
            console.log(`Ejecución ${i + 1} (${nombreArchivoDatos}) completa.`);

            await new Promise(resolve => setTimeout(resolve, 15000));

            await extraerDatosYGuardarJson(url, nombreArchivoNewDatos);
            console.log(`Ejecución ${i + 1} (${nombreArchivoNewDatos}) completa.`);

            const datos = JSON.parse(fs.readFileSync(nombreArchivoDatos, 'utf-8'));
            const newDatos = JSON.parse(fs.readFileSync(nombreArchivoNewDatos, 'utf-8'));
            const resultadoResta2 = datos.map((dato, index) => ({
                Nombre: dato.Nombre,
                id: index + 1,
                'ReputacionOriginal': dato.Reputacion,
                'NuevaReputacion': newDatos[index].Reputacion,
                'Diferencia': newDatos[index].Reputacion - dato.Reputacion,
            }));

            fs.writeFileSync('resultado_resta2.json', JSON.stringify(resultadoResta2, null, 2), 'utf-8');
            console.log('Resultado de la resta guardado en resultado_resta2.json');
        }
    } catch (error) {
        console.error(`Error en ejecutarProcesoVariasVeces2: ${error.message}`);
    }
}

// Exporta la función para ser utilizada desde otro módulo
module.exports = { ejecutarProcesoVariasVeces2 };

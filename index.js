
import express from 'express';
import cors from 'cors';
import path from 'path';
import translate from 'node-google-translate-skidz';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//Variables
let listaIds = [];
let deptosTraducidos = [];

// Importar fetch dinámicamente 
let fetch;
(async () => {
    const module = await import('node-fetch');
    fetch = module.default;
})();
//iniciar puerto
const port = process.env.PORT || 3000;
const app = express();

// Middleware para CORS y JSON
app.use(cors());
app.use(express.json());

// Middleware para servir archivos estáticos
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public/'));

// Ruta para servir el archivo HTML principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Ruta para servir el archivo HTML de imagenes extra
app.get("/add", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/img-adicionales.html'));
});
//listen de port
app.listen(port, () => {
    console.log(`Servidor funcionando en el puerto ${port}`);
});

// Endpoint para obtener el array de elementos buscados en caso de volver de pagina
app.get('/api/listaTraducuda', (req, res) => {
    res.json(deptosTraducidos);  // Envía el array como JSON
});

// Ruta para obtener todos los id de departamentos para DDL//ok
app.get('/api/traerIdDeptos', async (req, res) => {
    console.time('traerDeptos');
    try {
        const url = `https://collectionapi.metmuseum.org/public/collection/v1/departments`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.departments);

        console.timeEnd('traerDeptos');

    } catch (error) {
        console.error('Error al listar departamentos:', error);
        res.status(500).json({ message: 'Error al listar departamentos' });
    }
});

// Realizar búsqueda con filtros - genera url y peticion - llena listaIds local 
app.get('/api/buscar', async (req, res) => {
    console.time('buscar');
    const { filtro1, filtro2, filtro3, depto = 0, local = '', palabra = '' } = req.query;

    console.log(req.query)

    // Convertir a booleanos 
    let f1 = filtro1 === 'true';
    let f2 = filtro2 === 'true';
    let f3 = filtro3 === 'true';


    let url = '';

    if (f1 && f2 && f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${local}&q=${palabra}&DepartmentId=${depto}`;
    } else if (f1 && f2 && !f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${local}&q=*&DepartmentId=${depto}`;
    } else if (f1 && !f2 && f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${palabra}&DepartmentId=${depto}`;
    } else if (f1 && !f2 && !f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=*&DepartmentId=${depto}`;//
    } else if (!f1 && f2 && f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${local}&q=${palabra}`;
    } else if (!f1 && f2 && !f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${local}&q=*`;
    } else if (!f1 && !f2 && f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${palabra}`;
    } else if (!f1 && !f2 && !f3) {
        return res.json([]); // Ningún filtro seleccionado
    }

    try {
        //limpio la lista en caso de hacer nueva consulta
        listaIds = [];
        console.log('url: ' + url)
        const response = await fetch(url);
        const data = await response.json();
        
        //probando
        // Inicializar un array para almacenar los datos
        listaIds = data;
        //console.log('largo de lista ' + listaIds.objectIDs.length)
        
        res.json(data);
        console.timeEnd('buscar');

    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        res.status(500).json({ message: 'Error al realizar la búsqueda' });
    }
});

// Luego de llenar listaIds en el metodo anterior buscar, ejecuto llamado individual, todo en el back
app.get('/api/traerMuseosBack', async (req, res) => {
    console.time('traerMuseosBack')
    const pagina = parseInt(req.query.pagina, 10);
    let deptosPaginados = [];
    let deptosTraducidos = [];

    console.log(pagina);
    
    try {
        // Verifica si `listaIds.objectIDs` es un array
        if (Array.isArray(listaIds.objectIDs)) {
            // Condición para cuando tiene más de 100 elementos
            if (listaIds.objectIDs.length >= 150) {
                switch (pagina) {
                    case 1:
                        deptosPaginados = listaIds.objectIDs.slice(0, 150);
                        break;
                    case 2:
                        deptosPaginados = listaIds.objectIDs.length >= 300 ? listaIds.objectIDs.slice(150, 300) : [];
                        break;
                    case 3:
                        deptosPaginados = listaIds.objectIDs.length >= 450 ? listaIds.objectIDs.slice(300, 450) : [];
                        break;
                    case 4:
                        deptosPaginados = listaIds.objectIDs.length >= 600 ? listaIds.objectIDs.slice(450, 600) : [];
                        break;
                    case 5:
                        deptosPaginados = listaIds.objectIDs.length >= 750 ? listaIds.objectIDs.slice(600, 750) : [];
                        break;
                    default:
                        console.log('Página fuera de rango');
                        deptosPaginados = [];
                        break;
                }
            // Condición para cuando tiene entre 1 y 100 elementos
            } else if (listaIds.objectIDs.length > 0 && listaIds.objectIDs.length < 150) {
                deptosPaginados = listaIds.objectIDs; // Devuelve el mismo array si tiene entre 1 y 100 elementos
            } else {
                // Cuando el array no tiene ningún elemento
                console.log('El array está vacío.');
                deptosPaginados = [];
                res.json(deptosPaginados);
                return;
            }
        } else {
            console.log('El array listaIds.objectIDs no es un array válido.');
            deptosPaginados = [];
            res.json(deptosPaginados);
            return;
        }

        // Procesar deptosPaginados si no está vacío
        if (deptosPaginados.length > 0) {
            // promiseAll
            const deptos = await fetchIndividual(deptosPaginados);

            // Traducir las propiedades title, culture y dynasty de cada objeto
            deptosTraducidos = await Promise.all(
                deptos.map(async (objeto) => {
                    const traducirSiNoVacio = async (texto) => {
                        // Si existe traduzco, sino no
                        return texto ? await traducirTexto(texto) : texto;
                    };

                    // Traducir solo si el texto no está vacío
                    const [titleTraducido, cultureTraducido, dynastyTraducido] = await Promise.all([
                        traducirSiNoVacio(objeto.title),
                        traducirSiNoVacio(objeto.culture),
                        traducirSiNoVacio(objeto.dynasty)
                    ]);

                    return {
                        ...objeto,
                        title: titleTraducido,
                        culture: cultureTraducido,
                        dynasty: dynastyTraducido
                    };
                })
            );
        }

        console.timeEnd('traerMuseosBack');
        res.json(deptosTraducidos);

    } catch (error) {
        console.error('Error al obtener objetos filtrados:', error);
        res.status(500).json({ message: 'Error al obtener objetos' });
    }
});




// Método para traducir texto
const traducirTexto = async (texto, sourceLang = 'en', targetLang = 'es') => {
    try {
        // Traducir el texto
        const result = await translate({
            text: texto,
            source: sourceLang,
            target: targetLang
        });
        return result.translation; // Devolver la traducción
    } catch (error) {
        console.error('Error al traducir:', error);
        return texto; // En caso de error, devolver el texto original
    }
};


/////Probando mejorar tiempos con consultas multiples//////////////////////////
/////8.5segundos
const fetchIndividual = async (deptosPaginados) => {
    //console.time('fetchObjects');  // Inicia el temporizador
    const promises = deptosPaginados.map(async (id) => {
        const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
        try {
            const response = await fetch(objectUrl);

            // Verifica si el estado de la respuesta es 200 OK
            if (!response.ok) {
                return null; // Retorna null para que este objeto no se incluya en el resultado
            }

            const objectData = await response.json();

            // Retorna el objeto solo si tiene una imagen, de lo contrario retorna null
            return objectData.primaryImageSmall !== '' ? objectData : null;
        } catch (error) {
            console.error(`Error al procesar el objeto con ID ${id}:`, error);
            return null; // En caso de error, retornar null
        }
    });

    // Esperar a que todas las promesas se resuelvan
    const results = await Promise.all(promises);

    // Filtrar los resultados no nulos (los que sí tienen imagen)
    const deptos = results.filter(obj => obj !== null);

    // Limitar a 20 objetos
    return deptos.slice(0, 20);
};


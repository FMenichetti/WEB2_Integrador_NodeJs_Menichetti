const express = require('express');
const cors = require('cors');
const path = require('path');
const translate = require('node-google-translate-skidz');

//Variables
let listaIds = [];

// Importar fetch dinámicamente como ES module
let fetch;
(async () => {
    const module = await import('node-fetch');
    fetch = module.default;
})();
//iniciar puerto
const port = 3000;
const app = express();

// Middleware para CORS y JSON
app.use(cors());
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

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

// Ruta para obtener todos los id de departamentos para DDL//ok
app.get('/api/traerIdDeptos', async (req, res) => {
    try {
        const url = `https://collectionapi.metmuseum.org/public/collection/v1/departments`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.departments);
    } catch (error) {
        console.error('Error al listar departamentos:', error);
        res.status(500).json({ message: 'Error al listar departamentos' });
    }
});

// Realizar búsqueda con filtros - genera url y peticion - llena listaIds local 
app.get('/api/buscar', async (req, res) => {
    const { filtro1, filtro2, filtro3, depto = 0, local = '', palabra = '' } = req.query;

    // Convertir a booleanos 
    let f1 = filtro1 === 'true';
    let f2 = filtro2 === 'true';
    let f3 = filtro3 === 'true';

    let url = '';
    console.log(f1)
    console.log(f2)
    console.log(f3)
    console.log(depto)
    console.log(local)
    console.log(palabra)
    if (f1 && f2 && f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${local}&q=${palabra}&DepartmentId=${depto}`;
    } else if (f1 && f2 && !f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${local}&q=*&DepartmentId=${depto}`;
    } else if (f1 && !f2 && f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${palabra}&DepartmentId=${depto}`;
    } else if (f1 && !f2 && !f3) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/objects?DepartmentId=${depto}`;
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
        console.log(url + '//////')
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);

        //probando
        // Inicializar un array para almacenar los datos
        listaIds = data;


    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        res.status(500).json({ message: 'Error al realizar la búsqueda' });
    }
});

// Luego de llenar listaIds en el metodo anterior buscar, ejecuto llamado individual, todo en el back
app.get('/api/traerMuseosBack', async (req, res) => {

    const pagina = parseInt(req.query.pagina, 10);
    console.log(pagina)
    try {
        let deptos = [];

        switch (pagina) {
            case 1:
                deptosPaginados = listaIds.objectIDs.slice(0, 2000);
                break;
            case 2:
                deptosPaginados = listaIds.objectIDs.slice(2000, 4000);
                break;
            case 3:
                deptosPaginados = listaIds.objectIDs.slice(4000, 6000);
                break;
            case 4:
                deptosPaginados = listaIds.objectIDs.slice(6000, 8000);
                break;
            case 5:
                deptosPaginados = listaIds.objectIDs.slice(8000, 10000);
                break;
            default:
                console.log('Página fuera de rango');
                break;
        }

        //console.log(storedData)
        for (let id of deptosPaginados) {  // Aquí debería ser `idArray` para obtener cada ID
            const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
            //console.log(objectUrl)
            const objectResponse = await fetch(objectUrl);
            const objectData = await objectResponse.json();
            //console.log(objectData)

            if (objectData.primaryImageSmall !== '') { /////////////////////filtrar mas que no queden vacios
                deptos.push(objectData);
            }

            if (deptos.length >= 20) {
                break;
            }
        }

        ////////////////Probando traduccion
        // Traducir las propiedades title, culture y dynasty de cada objeto
        const deptosTraducidos = await Promise.all(
            deptos.map(async (objeto) => {
                const [titleTraducido, cultureTraducido, dynastyTraducido] = await Promise.all([
                    traducirTexto(objeto.title),
                    traducirTexto(objeto.culture),
                    traducirTexto(objeto.dynasty)
                ]);

                return {
                    ...objeto,
                    title: titleTraducido,
                    culture: cultureTraducido,
                    dynasty: dynastyTraducido
                };
            })
        );

        //console.log(deptosTraducidos)
        res.json(deptosTraducidos);
        //res.json(deptos);
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












// Ruta para obtener un objeto por ID
// app.get('/api/individual', async (req, res) => {
//     try {
//         // Extraer el ID de los parámetros de consulta
//         const { id } = req.query;

//         if (!id) {
//             return res.status(400).json({ message: 'ID es requerido' });
//         }

//         // URL del endpoint de la API externa con el ID incluido
//         const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
//         const response = await fetch(url);

//         if (!response.ok) {
//             console.error(`Error al buscar el objeto con ID: ${id}. Estado: ${response.status}`);
//             return res.status(response.status).json({ message: 'Error al buscar el objeto' });
//         }

//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         console.error('Error al obtener el objeto por ID:', error);
//         res.status(500).json({ message: 'Error al obtener el objeto por ID' });
//     }
// });



// Ruta para obtener los objetos filtrados por departamento
// app.get('/api/traerMuseosConId', async (req, res) => {
//     const { ids } = req.query; // Recibe la cadena de IDs desde los parámetros de consulta

//     if (!ids) {
//         return res.status(400).json({ message: 'No se proporcionaron IDs' });
//     }

//     try {
//         let deptos = [];

//         // Itera sobre cada ID en idArray
//         console.log(ids)
//         for (let id of ids) {  // Aquí debería ser `idArray` para obtener cada ID
//             const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
//             //console.log(objectUrl)
//             const objectResponse = await fetch(objectUrl);
//             const objectData = await objectResponse.json();
//             //console.log(objectData)

//             if (objectData.primaryImageSmall !== '') {
//                 deptos.push(objectData);
//             }

//             if (deptos.length >= 30) {
//                 break;
//             }
//         }

//         res.json(deptos);
//     } catch (error) {
//         console.error('Error al obtener objetos filtrados:', error);
//         res.status(500).json({ message: 'Error al obtener objetos' });
//     }
// });


// Obtener localizaciones  de objetos
// app.get('/api/traerLocal', async (req, res) => {
//     try {
//         // Hacer la petición inicial a la API para obtener todos los objectIDs
//         const apiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';
//         const response = await fetch(apiUrl);
//         const data = await response.json();

//         const objectIDs = data.objectIDs; // Lista de objectIDs obtenidos desde la API
//         //console.log(objectIDs)
//         if (!objectIDs || objectIDs.length === 0) {
//             return res.status(404).json({ message: 'No se encontraron objetos.' });
//         }

//         let location = '';
//         // Iterar sobre cada ID en objectIDs
//         for (let i = 0; i < objectIDs.length; i += 1) {/////no funciona
//             const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${i}`;
//             const respObj = await fetch(objectUrl);
//             const objData = await respObj.json();
//             // Verificar si el campo 'repository' existe y no está vacío
//             if (objData.country && objData.country.trim() !== '') {
//                 location = objData.country;
//                 //console.log(objData.repository)
//             }
//             // Si la localización no está vacía y no se repite, añadirla a listaLocal
//             if (location && !listaLocal.includes(location)) {
//                 listaLocal.push(location);
//                 console.log(location + ' agregado')
//             }
//             // Detener cuando listaLocal tenga 15 localizaciones únicas
//             if (listaLocal.length >= 15) {
//                 break;
//             }
//         }

//         // Enviar la lista de localizaciones como respuesta
//         res.json(listaLocal);
//     } catch (error) {
//         console.error('Error al obtener localizaciones:', error);
//         res.status(500).json({ message: 'Error al obtener localizaciones' });
//     }
// });
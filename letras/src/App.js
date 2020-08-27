import React, {Fragment, useState, useEffect} from 'react';
import Formulario from './components/Formulario';
import Cancion from './components/Cancion';
import Info from './components/Info';
import Error from './components/Error';
import axios from 'axios';

function App() {

  //definir el state
  const [busquedaletra, guardarBusquedaLetra] = useState({});
  const [letra, guardarLetra] = useState('');
  const [info, guardarInfo] = useState({});
  const [error, guardarError] = useState(false);

  useEffect(() => {
    if(Object.keys(busquedaletra).length === 0) return;

    const consultarApiLetra = async() => {
        const {artista, cancion} = busquedaletra;
        const URLletra = `https://api.lyrics.ovh/v1/${artista}/${cancion}`;
        const URLinformacion = `https://theaudiodb.com/api/v1/json/1/search.php?s=${artista}`;

        axios.all([
          axios.get(URLletra),
          axios.get(URLinformacion)
        ])
        .then(axios.spread((letter, information) => {
          guardarLetra(letter.data.lyrics);
          guardarInfo(information.data.artists[0]);
        }))
        .catch(err => {
          guardarError(true);
        })

        guardarError(false);
    }

    consultarApiLetra();

}, [busquedaletra, info]);


  return (
    <Fragment>
        <Formulario
          guardarBusquedaLetra={guardarBusquedaLetra}
        />

        {error ? <Error mensaje="La canción no se encuentra disponible"/> : null}

        <div className="container mt-5">
            <div className="row"> 
                <div className="col-md-6">
                  <Info
                      info={info}
                  />
                </div>
                <div className="col-md-6">
                    <Cancion
                        letra={letra}
                    />
                </div>
            </div>
        </div>
    </Fragment>
  );
}

export default App;

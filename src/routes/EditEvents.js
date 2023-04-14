import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Select, MenuItem } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button, Divider, Typography, TextField } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';
import swal from 'sweetalert2';
import Navbar from '../components/NavBar';
import './swal.css'



const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e9bc65',
    },
    tertiary: {
      main: 'black',
    },
  },
});




const EditEvent = () => {


  let props = sessionStorage.getItem("publication_data")
  props = (JSON.parse(props))



  const userRef = useRef();
  const errRef = useRef();
  const [error, setError] = useState(false);
  const [id_event, setEventID] = useState(props.id);
  const [title, setTitle] = useState(props.title)
  const [category, setCategory] = useState(props.category);
  const [date, setDate] = useState(props.date);
  const [description, setDescription] = useState(props.description);
  const [capacity, setCapacity] = useState(props.capacity);
  const [vacancies, setVacancies] = useState('');
  const [direction, setDirection] = useState(props.direction);
  const [latitude, setLatitude] = useState(props.latitude);
  const [length, setLength] = useState(props.length);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  let minDate = tomorrow.toISOString().split('T')[0];



  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      swal.fire({
        title: "Elegui otra fecha",
        text: "Recuerda que la proxima fecha disponible es el " + new Date(minDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }),
        icon: "warning",
        confirmButtonText: 'Entendido',
      })

    } else {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleDateChangeTickets = (e) => {
    const numberOfTickets = e.target.value;


    if (numberOfTickets > 10000) {
      swal.fire({
        title: "Excediste el número de entradas permitidas",
        text: "Recuerda que el numero de entradas debe ser inferior a 10.000",
        icon: "warning",
        confirmButtonText: 'Entendido',
      })

    } else {
      setCapacity(numberOfTickets);
    }
  };


  sessionStorage.setItem("event_id", id_event);

  console.log(length);


  const handleSubmit = async (e) => {
    e.preventDefault();

    let token_user;
    // window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaHJpc3RpYW4uZml1YmFAZ21haWwuY29tIiwiZXhwIjoxNjgxMDc2MDQyfQ.Wh-28x-wKNO3P6QJ3rt2wq8fLb4C6XSB4TJF3NFPRDE' )


    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }




    try {

      var options = {
        method: 'PUT',
        url: '/organizer/event',
        params: { '': '' },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token_user}`
        },
        data: {

          "id": id_event,
          "title": title,
          "category": category,
          "date": date,
          "description": description,
          "direction": direction,
          "latitude": 0,
          "longitude": 0,
          "capacity": capacity,
          "vacancies": 0
        }
      };

      axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });


      sessionStorage.setItem("event_id", id_event);
      window.localStorage.setItem("foto_actualizada", false)

      swal.fire({
        title: "Has modificado tu evento correctamente",
        icon: "success",
        customClass: {
          container: 'spotify-modal-container',
          popup: 'spotify-modal-popup',
          title: 'spotify-modal-title',
          content: 'spotify-modal-content',
          confirmButton: 'spotify-modal-button',
          cancelButton: 'spotify-modal-button'
        },
        showCancelButton: true,
        showCloseButton: true,
        cancelButtonText: "Agregar o quitar fotos de mi evento",
        confirmButtonText: "Ir a mis eventos"
      }).then(function (result) {
        if (result.isConfirmed) {
          window.location.href = "http://localhost:3000/showEvents";
        } else if (result.isDismissed) {
          //window.location.href = "http://localhost:3000/editGallery";
        }
      });



    } catch (err) {
      setError(true)
      if (!err?.response) {
        setErrMsg('El servidor no responde');
      } else if (err.response?.status === 401) {
        setErrMsg('Contraseña o usuario incorrecto');
      } else if (err.response?.status === 402) {
        setErrMsg('No tiene autorización');
      } else {
        setErrMsg('El ingreso ha fallado');
      }

    }
  }


  const loadImages = () => {
    window.location.href = "/editGallery";
  }


  const onReturn = () => {
    window.location.href = "/showEvents";
  }


  /*------------------------------------------------------------------------------------------------------------------------*/
  return (

    <ThemeProvider theme={theme}>
      <Box sx={{ border: '1px solid black' }}>
        <Navbar />
        <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
          Editar el evento
        </Typography>
        <Stack direction="row" spacing={15} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Stack
            direction="column"
            spacing={3}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              maxWidth: '100%',
              padding: '0 1rem',
              fontFamily: 'Arial, sans-serif',
              fontSize: '1rem',
              flexGrow: 1,

              border: '8px solid $primary-color' /* Agrega el borde */
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>

                <TextField error={error} fullWidth sx={{ m: 1 }} label="Nombre del evento" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Tipo de evento"
                    onChange={(e) => setCategory(e.target.value)}



                  >

                    <MenuItem sx={{ color: 'black' }} value="Evento deportivo">Evento deportivo</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Cena o gala">Cena o gala</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Clase, curso o taller">Clase, curso o taller</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Performance">Performance</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Conferencia">Conferencia</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Encuentro">Encuentro</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Networking">Networking</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Feria">Feria</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Festival">Festival</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Fiesta" >Fiesta</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Competencia">Competencia</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Promoción">Promoción"</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Seminario">Seminario</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Show">Show</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Torneo">Torneo</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Visita">Visita</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Otro">Otro</MenuItem>
                  </Select>

                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth sx={{ m: 1 }} type="date" id="date" name="date" onChange={handleDateChange} value={date || ' '} min={minDate = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth sx={{ m: 1 }} label="Descripcion" value={description} variant="outlined" onChange={(e) => setDescription(e.target.value)} />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth sx={{ m: 1 }} type="number" label="Cantidad de tickets" value={capacity} variant="outlined" onChange={handleDateChangeTickets} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth sx={{ m: 1 }} label="Dirección" value={direction} variant="outlined" onChange={(e) => setDirection(e.target.value)} />
              </Grid>

            </Grid>











            <Divider />



          </Stack>

        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Editar el evento</Button>
        </Box>
      </Box>

    </ThemeProvider>
  );
}

export default EditEvent;

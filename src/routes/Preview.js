import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from '../api/axios';
import swal from 'sweetalert2';


const Preview = () => {

 const [error, setError] = useState(false);
 const [errMsg, setErrMsg] = useState('');
 const errRef = useRef();

 let props = JSON.parse(window.localStorage.getItem("event"));
 
 console.log(props);

 const stringDate = new Date(props.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

  
 const handleSubmitEvent = async (e) => {
    e.preventDefault();
    let photos = [];


    window.localStorage.setItem("photos_user", JSON.stringify(photos));

    /*console.log("hola")
    console.log(title);
    console.log(category);
    console.log(date);
    console.log(description);
    console.log(capacity);
    //console.log (vacancies);
    console.log(direction);
    console.log(latitude);
    console.log(longitude);*/


    let token_user;

    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }

    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }


      try {
        const response = await axios.post('organizer/event',
          JSON.stringify(props),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token_user}`
            }
          }

        );
        console.log(response.status);
        window.localStorage.setItem("event_id", response.data.id);
        window.location.href = "/showEvents";
      } catch (err) {
        setError(true)
        if (!err?.response) {
          setErrMsg('El servidor no responde');
        } else if (err.response?.status === 401) {
          setErrMsg('Contraseña o usuario incorrecto');
        } else if (err.response?.status === 402) {
          setErrMsg('No tiene autorización');
        } else {
          token_user = window.localStorage.getItem("token");
        }

      }
     
  }


 return (

  <Box sx={{ mb: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 2, backgroundColor: '#fff', color: '#282828' }}>
        <CardContent sx={{ pb: 2 }}>
          <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
            Confirme los datos del evento
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
            {props.title}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontSize: 20, fontWeight: 700, mb: 1 }}>
            {props.category}
          </Typography>
          <Typography color="textSecondary" sx={{ fontSize: 14, fontWeight: 400, color: '##1286f7', mb: 1 }}>
            {stringDate}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1 }}>
            {props.direction}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1 }}>
            {props.capacity}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1 }}>
            {props.description}
          </Typography>

        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', pt: 0 }}>
          <Button onClick={handleSubmitEvent} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#191414', borderRadius: 2, px: 2, py: 1, mr: 1, '&:hover': { backgroundColor: '#1286f7' } }}>
            Aceptar
          </Button>
          <Button onClick={() => {window.location.href = '/loadEvent'}} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#191414', borderRadius: 2, px: 2, py: 1, '&:hover': { backgroundColor: '#1c1c1c' } }}>
            Volver
          </Button>
        </CardActions>
      </Card>
    </Box>


 )
}

export default Preview


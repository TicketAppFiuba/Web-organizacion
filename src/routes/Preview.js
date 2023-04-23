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
import Navbar from '../components/NavBar';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import ProgressBar from '../components/ProgressBar';


const Preview = () => {

 const [error, setError] = useState(false);
 const [errMsg, setErrMsg] = useState('');
 const errRef = useRef();
 const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
 //const [file, setFile] = useState(null);
 //const [error, setError] = useState(null);
 
 let props = JSON.parse(window.localStorage.getItem("event"));
 
 console.log(props);

 const stringDate = new Date(props.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
 
 const [url, setUrl] = useState('');
 const [progress, setProgress] = useState(window.localStorage.getItem('progress'));
 const [file, setFile] = useState(window.localStorage.getItem('file'));
 const [eventId, setEventId] = useState(null);

 
 useEffect(() => {
   const rawContent = JSON.parse(props.description);
   const contentState = convertFromRaw(rawContent);
   setEditorState (EditorState.createWithContent(contentState));    
   setUrl(window.localStorage.getItem('url')); 
   console.log(url);
 }, []);


  const saveImages = async () => {
  
    let photos = JSON.parse(window.localStorage.getItem("photos_user"));
      photos.push(url);
      window.localStorage.setItem("photos_user", JSON.stringify(photos));

      let token_user=window.localStorage.getItem("token"); 
      let id_event = window.localStorage.getItem("event_id"); 
      console.log('aca')
      console.log(url);
      console.log(id_event);
      
      try{    
       const response= axios.post('/organizer/event/images',
                 JSON.stringify({ 
                     'event_id': id_event,
                     'link': url
                 }),
                 {
                     headers: { 'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Credentials': true,
                                'Access-Control-Allow-Headers': '*',
                                'Authorization': 'Bearer ' + token_user,
                              }
                  },
 
             )
       .then((response) => {
       console.log("Imágen cargada");
       window.location.href = "/showEvents"
     })
     }catch (err) {console.log(err)}
  }
  
  
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

        ).then((response) => {window.localStorage.setItem("event_id", response.data.id);
          setEventId(response.data.id);
          saveImages();
          console.log(response.status); 
        })
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
 
  <Box sx={{ mb: 4, justifyContent: 'center' }}>
      <Navbar />

       <Typography variant="h5" component="div" sx={{ marginTop: '10px', color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
            Crear evento
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontSize: 14, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
            Confirme los datos del evento
          </Typography>

       <Card variant="outlined" sx={{ border:'2px solid black', borderRadius: 2, backgroundColor: '#fff', color: 'black',
                                      justifyContent: 'center', width: '700px', height: '500px', marginLeft: '270px'}}>
        <CardContent sx={{ pb: 2, justifyContent: 'center' }}>
                    
          <img src={url} alt="preview" height="180" style={{ marginTop: '20px', marginLeft: '200px', display: 'flex', justifyContent: 'center' }} />
          
          <Typography variant="h6" component="div" sx={{ marginTop: '20px', fontSize: 16, fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'center' }}>
            {props.category}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontSize: 20, fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'center' }}>
            {props.title}
          </Typography>
          <Typography color="textSecondary" sx={{ fontSize: 14, fontWeight: 400, color: '##1286f7', mb: 1, display: 'flex', justifyContent: 'center' }}>
            {stringDate}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
            {props.ubication.direction}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
            Capacidad: {props.capacity}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
            {editorState.getCurrentContent().getPlainText()}
          </Typography>

        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center', pt: 0 }}>
          <Button onClick={handleSubmitEvent} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, justifyContent: 'center',
           color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 2, py: 1, mr: 1, '&:hover': { backgroundColor: '#1286f7' } }}>
            Aceptar
          </Button>
          <Button onClick={() => {window.history.back()}} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", justifyContent: 'center',
           fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 2, py: 1, '&:hover': { backgroundColor: '#1c1c1c' } }}>
            Volver
          </Button>
        </CardActions>
       </Card>
      
    </Box>

 )
}

export default Preview


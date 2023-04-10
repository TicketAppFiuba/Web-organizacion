import React from 'react';
import { useRef, useState } from "react";
import './CreateEventForm.scss';
import axios from '../api/axios';
import swal from "sweetalert2";
import './swal.css';
import Footer from '../components/Foter.jsx'


const CreateEventForm = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [error, setError] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [vacancies, setVacancies] = useState('');
  const [direction, setDirection] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const minDate = tomorrow.toISOString().split('T')[0];


  const handleSubmit = async (e) => {
    e.preventDefault();


    console.log("hola")
    console.log(title);
    console.log(category);
    console.log(date);
    console.log(description);
    console.log(capacity);
    //console.log (vacancies);
    console.log(direction);
    console.log(latitude);
    console.log(longitude);

    // if button enabled with JS hack floors
    let token_user;
    //window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZWNhc3RpbGxvQGZpLnViYS5hciIsImV4cCI6MTY4MTA4Mzk0OH0.1lfXwumeCg1OGgP6lGdJNd4SeEwqbRlhNjP0wWyo_Lk' )

    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }




    try {
      const response = await axios.post('organizer/event',
        JSON.stringify({
          "title": title,
          "category": category,
          "date": date,
          "description": description,
          "capacity": capacity,
          "vacancies": 0,
          "ubication": {
            "direction": direction,
            "latitude": 0,
            "longitude": 0
          }
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token_user}`
          }
        }

      );
      console.log(response.status);
      sessionStorage.setItem("event_id", response.data.id);

      swal.fire({
        title: "Has creado tu evento correctamente, ¿qué deseas hacer?",
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
        cancelButtonText: "Agregar fotos a mi evento",
        confirmButtonText: "Ir a mis eventos"
      }).then(function (result) {
        if (result.isConfirmed) {
          window.location.href = "http://localhost:3000/showEvents";
        } else if (result.isDismissed) {
          window.location.href = "http://localhost:3000/imageLoader";
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
        token_user = window.localStorage.getItem("token");
      }

    }
  }


  const loadImages = () => {
    window.location.href = "/imageLoader";
  }


  /*------------------------------------------------------------------------------------------------------------------------*/
  return (
    <div>
      <form className="create-event-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Crear evento</h2>
        <div className="form-group">
          <label htmlFor="title">Nombre del evento</label>
          <input type="text" id="title" name="event-name" onChange={(e) => setTitle(e.target.value)}
            value={title}
            required />
        </div>
        <div className="form-group">
          <label htmlFor="category">Categoría</label>
          <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} required  >
            <option value="">Seleccionar categoría</option>
            <option value="Evento deportivo" style={{ color: 'black' }}>Evento deportivo</option>
            <option value="Cena o gala" style={{ color: 'black' }}>Cena o gala</option>
            <option value="Clase, curso o talle" style={{ color: 'black' }}>Clase, curso o talle</option>
            <option value="Performance" style={{ color: 'black' }}>Performance</option>
            <option value="Conferencia" style={{ color: 'black' }}>Conferencia</option>
            <option value="Encuentro" style={{ color: 'black' }}>Encuentro</option>
            <option value="Networking" style={{ color: 'black' }}>Networking</option>
            <option value="Feria" style={{ color: 'black' }}>Feria</option>
            <option value="Festival" style={{ color: 'black' }}>Festival</option>
            <option value="Fiesta" style={{ color: 'black' }}>Fiesta</option>
            <option value="Competencia" style={{ color: 'black' }}>Competencia</option>
            <option value="Promoción" style={{ color: 'black' }}>Promoción</option>
            <option value="Seminario" style={{ color: 'black' }}>Seminario</option>
            <option value="Show" style={{ color: 'black' }}>Show</option>
            <option value="Torneo" style={{ color: 'black' }}>Torneo</option>
            <option value="Visita" style={{ color: 'black' }}>Visita</option>
            <option value="Otro" style={{ color: 'black' }}>Otro</option>

          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Fecha</label>
          <input type="date" id="date" name="date" onChange={(e) => setDate(e.target.value)} value={date || ''} min={minDate} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea id="description" name="description" onChange={(e) => setDescription(e.target.value)}
            value={description} rows="4"></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Cantidad de tickets</label>
          <input type="number" id="capacity" name="capacity" min="0" onChange={(e) => setCapacity(e.target.value)}
            value={capacity}
            required />
        </div>
        <div className="form-group">
          <label htmlFor="direction">Dirección</label>
          <input type="text" id="direction" name="direction" onChange={(e) => setDirection(e.target.value)}
            value={direction}
            required />
        </div>

        {/*<div className="form-group">
        <label htmlFor="latitude">Latitud</label>
        <input type="number" id="latitude" name="latitude" min="0" step="1" onChange={(e) => setLatitude(e.target.value)}
                            value={latitude}
                            required />
      </div>
      <div className="form-group">
        <label htmlFor="length">Longitud</label>
        <input type="number" id="length" name="length" min="0" step="1" onChange={(e) => setLength(e.target.value)}
                            value={length}
                            required />
      </div>*/}
        <div className="form-group form-group-images">
          <label htmlFor="location">Elegui las fotos de tu evento</label>
          <div className="location-map">
            <div className="form-group" >
              <button type="button" className="btn-style btn-upload-images" onClick={(e) => { loadImages() }} >Subir imagenes</button>
            </div>

          </div>
        </div>
        <div className="form-actions">
          <button type="submit" >Crear evento</button>
        </div>
      </form>
      <Footer />
    </div>
  );
}

export default CreateEventForm;

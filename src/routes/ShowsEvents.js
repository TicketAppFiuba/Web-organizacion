import React from 'react';

import data from '../data/dataPropiedad';
import Card from "../components/Card"
import CardEvent from "../components/CardEvent"
import { useEffect, useState } from "react";
import axios from '../api/axios';

const ShowsEvents = () => {



  const [publications, setPublications] = useState([]);

  const loadPublications = () => {
    
    let token_user;
    window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaHJpc3RpYW4uZml1YmFAZ21haWwuY29tIiwiZXhwIjoxNjgxMDc2MDQyfQ.Wh-28x-wKNO3P6QJ3rt2wq8fLb4C6XSB4TJF3NFPRDE');

    if (!window.localStorage.getItem("token")){
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
      console.log("aca entro")
    }

    console.log("antes de axios")
    axios.get('/organizer/events', {
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token_user}`
        }
    })
    .then((response) => {
      setPublications(response.data);
     
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  useEffect(() => {
    loadPublications();
  }, []);

    const cards = publications.map(item => {

        return (
        
          <Card
            key={item.id}
            {...item}
          />
        )
      })

      return (
        
     
        (publications && publications.length > 0) ?
        <div>
           <CardEvent />
            {cards}


        </div>
        :  <div>

        <CardEvent/>


    </div>
      )
}

export default ShowsEvents
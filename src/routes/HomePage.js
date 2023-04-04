import React from 'react';
import './HomePage.scss';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import axios from '../api/axios';

const HomePage = () => {
  // Animación del botón de llamado a la acción
  const [ctaSpring, setCTASpring] = useSpring(() => ({
    transform: 'scale(1)',
    from: { transform: 'scale(0)' },
    config: { mass: 1, tension: 500, friction: 30 }
  }));

  const LOGIN_URL = '/organizer/login';

  const handleSubmit = async (e) => {
  
    window.location.href = "http://localhost:8000/organizer/login"

    /*axios.get(LOGIN_URL, {}, {
      headers: { 'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*"
       }})
    .then((response) => {
      console.log(response)
      
    })
    .catch((error) => {
      console.log(error);
    });*/
    

}

  return (
    <div className="homepage">
      <header className="header">
        <nav className="header__nav">
          <Link to="/" className="header__logo">TICKETAPP</Link>
          
          <button className="header__btn">Iniciar sesión</button>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-section__content">
          <h1 className="hero-section__title">¡Organiza los mejores eventos de tu ciudad, de la manera más facil posible!</h1>
          <p className="hero-section__subtitle">Accede a todo lo que tenemos para ofrecerte.</p>
          
           <button className="header__btn" onClick={handleSubmit}>Iniciar sesión</button>
          
        </div>
      </section>

    
      <footer className="footer">
        <ul className="footer__menu">
          <li><Link to="/about">Acerca de nosotros</Link></li>
          <li><Link to="/terms">Términos y condiciones</Link></li>
          <li><Link to="/privacy">Política de privacidad</Link></li>
        </ul>
      
      </footer>
    </div>
  );
};

export default HomePage;
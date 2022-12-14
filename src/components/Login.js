import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import axios from 'axios'

//logowanie istniejących użytkowników

function Login(props) {
  const [username, setUsername] = useState('') //do przesyłania loginu z pola tekstowego do api i czyszczenia owego pola po kliknieciu przycisku
  const [password, setPassword] = useState('') ////do przesyłania hasła z pola tekstowego do api i czyszczenia owego pola po kliknieciu przycisku
  const [error, setError] = useState('') ////error odp z seerwera

 

  const loginHandler = () => {
    setError('')
    setUsername('')
    setPassword('')
    axios
      .post('http://localhost:8000/auth/', {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res.data.token)
        props.settoken(res.data.token)
        localStorage.setItem('userToken', res.data.token)
      })
      .catch((error) => {
        console.log(error.response.data.non_field_errors)
        setError(error.response.data.non_field_errors)
      })
  }

  return (
    <section class='section is-large'>
      {props.token && (
        <Navigate to='/' replace={true} />
      )}
      <div class='column is-half is-offset-one-quarter'>
        
        <p>Podaj swoje dane logowania</p>
        <div class='field'>
          <p class='control '>
            <input
              class='input'
              type='name'
              placeholder='Login'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </p>
        </div>
        <div class='field'>
          <p class='control '>
            <input
              class='input'
              type='password'
              placeholder='Hasło'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </p>
          {error && <p class='has-text-centered has-text-danger'>{error}</p>}
        </div>
        <div class='field'>
          <p class='control'>
            <button class='button is-success mr-2' onClick={loginHandler}>
              Zaloguj się
            </button>

            <Link to={'/register'} state={{ data: 'abc' }}>
              <button class='button is-info'>Rejestracja</button>
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Login

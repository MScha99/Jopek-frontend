import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@mdi/react'
import { mdiAccount, mdiBasketOutline } from '@mdi/js'
import logo from './logo.png'

//poziomy navbar na górze ekranu

function Navbar() {
  const [token, setToken] = useState(localStorage.getItem('userToken') ?? null)
  const logoutHandler = () => {  //kliknięcie wyloguj -> czyszczenie tokenu z pamięci
    setToken('')
    localStorage.clear()
  }

  return (
    <nav class='navbar' role='navigation' aria-label='main navigation'>
      <div class='navbar-brand'>
        <a class='navbar-item' href='/'>
          <img src={logo} width='112' height='28' alt='#' />
        </a>

        
      </div>

      <div id='navbarBasicExample' class='navbar-menu'>
        <div class='navbar-start'>
          <Link to='/' class='navbar-item'>
            Sklep
          </Link>
          <Link to='/rent' class='navbar-item'>
            Wypożyczalnia
          </Link>
          
        </div>
        

        <div class='navbar-end'>
          <div class='navbar-item'>
            <Link to='/cart'>
              <div class='mr-3 mt-1 is-hoverable'>
                <Icon path={mdiBasketOutline} title='User Profile' size={1.5} />
              </div>
            </Link>

            {token ? (
              <div class='navbar-item has-dropdown is-hoverable '>
                <a class='navbar-link'>
                  <Icon path={mdiAccount} title='User Profile' size={1.5} />
                </a>

                <div class='navbar-dropdown is-right'>
                  <Link to='/orderhistory' class='navbar-item'>
                    Historia zamówień
                  </Link>
                  <Link to='/renthistory' class='navbar-item'>
                    Aktualne wypożyczenia
                  </Link>
                  <a
                    href='/'
                    alt='#'
                    class='navbar-item'
                    onClick={logoutHandler}
                  >
                    Wyloguj się
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <a href={'/register'} class='button is-primary'>
                  <strong>Zarejestruj się</strong>
                </a>
                <a href={'/login'} class='button is-light'>
                  Zaloguj się
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )


}

export default Navbar

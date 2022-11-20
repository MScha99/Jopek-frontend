import React, { useState } from 'react'
import 'bulma/css/bulma.css'
import './App.css';
import ProductList from './components/ProductList'
import ProductPage from './components/ProductPage'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Register from './components/Register'
import Cart from './components/Cart'
import OrderHistory from './components/OrderHistory'
import RentHistory from './components/RentHistory'
import Rent from './components/Rent'
import { Route, Routes } from 'react-router-dom'

function App() {
  const [token, setToken] = useState(localStorage.getItem('userToken') ?? null) //token do autoryzacji z backendem
  const [cartItems, setCartItems] = useState(     //produkty w koszyku
    JSON.parse(localStorage.getItem('cartItems')) ?? []
  )

    //obsługuje dodawanie produktów do koszyka
  const addHandler = (product) => {
    const exists = cartItems.find((j) => j.id === product.id)
    if (exists) {
      const newCartItems = cartItems.map((j) =>
        j.id === product.id ? { ...exists, quant: exists.quant + 1 } : j
      )
      //jeżeli id sie zgadza to quant+1, inaczej zostaw
      if (product.stock > exists.quant) {
        setCartItems(newCartItems)
        localStorage.setItem('cartItems', JSON.stringify(newCartItems))
      }
    } else {
      //jeżeli nie ma w koszyku to dopisz i dodaj mu quant 1
      const newCartItems = [...cartItems, { ...product, quant: 1 }]
      setCartItems(newCartItems)
      localStorage.setItem('cartItems', JSON.stringify(newCartItems))
    }
  }
  //obsługuje usuwanie produktów z koszyka
  const removeHandler = (product) => {
    const exists = cartItems.find((j) => j.id === product.id)
    if (exists.quant === 1) {
      const newCartItems = cartItems.filter((j) => j.id !== product.id)
      setCartItems(newCartItems)
      localStorage.setItem('cartItems', JSON.stringify(newCartItems))
    } else {
      const newCartItems = cartItems.map((j) =>
        j.id === product.id ? { ...exists, quant: exists.quant - 1 } : j
      )
      setCartItems(newCartItems)
      localStorage.setItem('cartItems', JSON.stringify(newCartItems))
    }
  }


  return (
    <div className='app'>
      {token ? (
        <Navbar
       key={Date.now()}
        />
      ) : (
        <Navbar token={null} settoken={setToken} />
      )}

      <Routes>
        <Route path='/'>
          <Route index element={<ProductList/>} />
          <Route
            path=':slug'
            element={
              <ProductPage
               
                cartItems={cartItems}
                addHandler={addHandler}
                removeHandler={removeHandler}
              />
            }
          />
          <Route
            path='login'
            element={<Login token={token} settoken={setToken} />}
          />
          <Route path='register' element={<Register />} />
          <Route path='orderhistory' element={<OrderHistory />} />
          <Route
            path='cart'
            element={
              <Cart
                cartItems={cartItems}
                addHandler={addHandler}
                removeHandler={removeHandler}
                setCartItems={setCartItems}
              />
            }
            
          />
          <Route path='Rent' element={<Rent/>}/>
          <Route path='renthistory' element={<RentHistory/>}/>
          
        </Route>
      </Routes>
    </div>
  )
}
export default App

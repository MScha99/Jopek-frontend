import React, { useState } from 'react'
import axios from 'axios'


function Cart(props) {
  const { cartItems,setCartItems, addHandler, removeHandler } = props
  const quantPrice = cartItems.reduce((a, c) => a + c.quant * c.price, 0)

  //console.log(cartItems)
  
  const [error, setError] = useState('')
  const [token] = useState(localStorage.getItem('userToken') ?? null)
  const [notes, setNotes] = useState('1')
  const [city, setCity] = useState('1')
  const [street, setStreet] = useState('1')
  const [zipcode, setZipcode] = useState('1')
  const [orderid, setOrderid] = useState('')
 
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cartItems')
  }
 

  const orderHandler = () => {
    setError('')

    token
      ? axios
          .post(
            'http://localhost:8000/order/',
            {
              notes: notes,
              price: quantPrice,
              city: city,
              street: street,
              zipcode: zipcode,
            },
            {
              headers: {
                Authorization: 'Token ' + token,
              },
            }
          )    
         
          .then((response) => {
            cartItems.map((j) =>
              axios.post(
                'http://localhost:8000/orderproduct/',
                {
                  order: response.data.id,
                  product: j.id,
                  quantity: j.quant,
                },
                {
                  headers: {
                    Authorization: 'Token ' + token,
                  },
                }
              )
            )

            setOrderid(response.data.id)
           
          })
          .then(()=>{
            clearCart()
            //alert("Zamówienie zostało złożone")
          })
          .then(()=>{
            if (window.confirm('Czy chcesz otrzymać potwierdzenie mailowe?')) {
              axios('http://localhost:8000/order/', {
                headers: {
                  Authorization: 'Token ' + token,
                },
              })
              
            } else {
              // Do nothing!
             }

          }
          )
          
          .catch((error) => {
            console.log(error.response.data.body)
            setError(error.response.data.body)
          })

      : setError('Musisz być zalogowany')
  }


  return (
    <div class='section'>
       {cartItems.length === 0 && <div class="title has-text-centered mt-6 ">Koszyk jest <strong>pusty</strong></div>}
       {cartItems.length !== 0 && <div>
      <div class='column is-half is-offset-one-quarter '>
        <p class='title'>Zawartość koszyka:</p>
        
        {cartItems.map((item) => (
          <div key={item.id} class='columns is-flex is-vcentered box'>
            <div class='column is-narrow'>
              {
                <div key={item.image}>
                  <figure class='image is-96x96'>
                    <img src={item.image} alt='#' />
                  </figure>
                </div>
              }
            </div>

            <div class='column '>{item.name}</div>
            <div class='column has-text-right'>
              {item.quant} x {item.price.toFixed(2)}zł
            </div>

            <button onClick={() => addHandler(item)} class='button is-primary'>
              +
            </button>
            <button
              onClick={() => removeHandler(item)}
              class='button is-danger'
            >
              -
            </button>
          </div>
        ))}
        <div class='box has-text-centered'>
          <strong>
            łącznie do zapłacenia: {quantPrice} zł
          </strong>
          <br />
          <button
            onClick={() => {
              clearCart()
            }}
            class='button is-danger '
          >
            opróżnij koszyk
          </button>
        </div>
      </div>
      <div class='section mx-6'>
        <p class='title'>Adres zamówienia:</p>
        <div class='field'>
          <label class='label'>Miasto</label>
          <div class='control'>
            <input
              class='input'
              type='text'
              placeholder='Wrocław'
              
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div class='field'>
          <label class='label'>Adres</label>
          <div class='control'>
            <input
              class='input'
              type='text'
              placeholder='Curie-Skłodowskiej 51/5'
              
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
        </div>

        <div class='field'>
          <label class='label'>Kod pocztowy</label>
          <div class='control'>
            <input
              class='input'
              type='text'
              placeholder='50-369'
             
              onChange={(e) => setZipcode(e.target.value)}
            />
          </div>
        </div>

        <div class='field'>
          <label class='label'>
            Dodatkowe informacje dla sprzedawcy (opcjonalne){' '}
          </label>
          <div class='control'>
            <textarea
              class='textarea'
              placeholder='tekst'
              
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
        </div>

        <p>
          Zamawiając godzisz się na <a>zasady i warunki korzystania</a>
        </p>

        <button onClick={orderHandler} class='button is-info mr-1'>
          Zapłać i złóż zamówienie
        </button>
        {error ? <p>{error}</p>:null}
        
      </div>
      </div>}
    </div>
  )
}

export default Cart

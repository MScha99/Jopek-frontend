import React, { useState, useEffect } from 'react'
import axios from 'axios'

//podstrony poszczególnych produktów + sekcja komentarzy. Pisanie komentarzy tylko dla zalogowanych użytkowników (sprawdzane obecnością tokena w localstorage)

function ProductPage(props) {
  const { addHandler, removeHandler, cartItems } = props
  const location = window.location.pathname // zapisuje lokacje np "/cart"
  const [products, setProducts] = useState([]) //produkty pobrane z api
  const [error, setError] = useState('') //do wyswietlania error odp z api
  const [body, setBody] = useState('') //treść komentarza pisanego przez użytkownika
  const [token] = useState(localStorage.getItem('userToken') ?? null)
  const [comments, setComments] = useState([]) //komentarze pobrane z api
  const [loading, setLoading] = useState('True') //do czekania na załadowanie danych i re-fetchowania po napisaniu komentarza
 
useEffect(()=>{
  window.scrollTo(0, 0);
},[])


  useEffect(() => {
    
    axios('http://localhost:8000/api' + location)
      .then((res) => {
        // console.log(res.data, "res data result")
        setProducts(res.data)
        axios('http://localhost:8000/comments/' + '?product=' + res.data.id)
        .then((res) => {
          // console.log(res.data)
          setComments(res.data)
        })
        .catch((error) => {
          console.log(error.response.data.body)
         
        })
      }).then(()=> {
        
      })
      .catch((error) => {
        console.log(error.response.data.body)
       
      })
  }, [loading])



  const commentHandler = () => {
    setError('')
   setLoading('')
    
    token
      ? axios
          .post(
            'http://localhost:8000/comments/',
            {
              product: products.id,
              body: body,
            },
            {
              headers: {
                Authorization: 'Token ' + token,
              },
            }
          )
          .then(() => {
           setLoading('False')
          })

          .catch((error) => {
            console.log(error.response.data.body)
            setError(error.response.data.body)
          })
      : setError('Funkcja tylko dla zalogowanych użytkowników')
      setBody('')
  }

  return ( 
    <section class='section is-small mx-6'>
      
      <div class='columns is-multiline box'>
        <div class='column is-half'>
          
            
              <figure class='image is-rectangle'>
                <img src={products.image} alt='#' />
              </figure>
                    
        </div>
        <div class='column is-half'>
          <section class='section has-text-centered is-medium'>
            <p class='is-size-2'>Cena: {products.price} zł</p>
            <p class='is-size-5'>Sztuk na stanie: {products.stock}</p>
            
            <button
              onClick={() => addHandler(products)}
              class='button is-primary'
            >
              dodaj do koszyka
            </button>
            <button
              onClick={() => removeHandler(products)}
              class='button is-danger'
            >
              usun z koszyka
            </button>
            {cartItems.map((item) => (
              <div>
                Sztuk w koszyku: {item.quant}
              </div>
            ))}
            {}
          </section>
        </div>



{products.category ? <div class='column box'>
          <h1 class='title'>{products.name}</h1>
          {products.category.map((b) => (
            <div key={b.name}>
              <p class='has-text-warning-dark'>{b.name}</p>
            </div>
          ))}
          <h2 class='subtitle'>{products.description}</h2>
        </div> : <p>loading</p>}

       

      </div>

      <section class='section is-medium mx-6'>
        <article class='media'>
          <div class='media-content'>
            <div class='field'>
              <p class='control'>
                <textarea
                  class='textarea'
                  value={body}
                  placeholder='Add a comment...'
                  onChange={(e) => setBody(e.target.value)}
                ></textarea>
              </p>
            </div>
            {error && <p class='has-text-centered has-text-danger'>{error}</p>}
            <nav class='level'>
              <div class='level-left'>
                <div class='level-item'>
                  <a class='button is-info' onClick={commentHandler}>
                    Submit
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </article>

        {comments.map((b) => (
          <article key={b.id} class='media'>
            <div class='media-content'>
              <div class='content'>
                <p>
                  <strong>{b.owner}</strong> <small>{b.created_on}</small>
                  <br />
                  {b.body}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </section>
  )
}

export default ProductPage

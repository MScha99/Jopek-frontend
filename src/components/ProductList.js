import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import 'bulma/css/bulma.css'
import axios from 'axios'

//wyświetlanie listy wszystkich produktów, pole wyszukiwania (po nazwie) i przyciski do filtrowania po kategorii
// obsługuje paginacje 

function ProductList() {
  const [products, setProducts] = useState([]) //produkty pobrane z api
  const [page, setPage] = useState(1) //do paginacji, jaką strone aktualnie wyświetlać
  const [totalPages, setTotalPages] = useState('') //do paginacji, ile jest łącznie stron 
  const perPage = 5 //do paginacji, ile produktów na strone zwraca api
  const [search, setSearch] = useState('') //do obsługi pola wyszukiwania
  const [searching, setSearching] = useState(false) //do obsługi przycisków paginacji na dole strony
  const [term, setTerm] = useState('') //do obsługi przycisków paginacji na dole strony

 

  const getList = (tag, button) => {
    //ściągnij produkty przefiltrowane (tag) ze strony paginacji nr button
    setSearch('')
    setTotalPages()
    setTerm(tag)
    setPage(button)
    setSearching(true)
   
    axios
      .get('http://127.0.0.1:8000/api/' + tag + '&page=' + button)
      .then((response) => {
        setProducts(response.data.results)
        setTotalPages(response.data.count / perPage)
      })
  }

  const allList = (button) => {
    //ściągnij wszystkie produkty
    setSearching(false)
    setPage(button)
    axios.get('http://127.0.0.1:8000/api/?page=' + button).then((response) => {
      setProducts(response.data.results)
      setTotalPages(response.data.count / perPage)
      window.scrollTo(0, 0)
    })
  }

  useEffect(() => {
    allList(1)
  }, [])

  return (
    <div>
      <div id='app'>
        <section class='main-content columns is-fullheight'>
          <aside class='column is-2 is-fullheight section '>
            <div class='field '>
              <p class='control is-expanded'>
                <input
                  class='input'
                  type='text'
                  placeholder='Nazwa'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </p>
              <p class='control'>
                <button
                  class='button is-info mt-2'
                  onClick={() => {
                    getList('?name=' + search, 1)
                  }}
                >
                  Wyszukaj
                </button>
              </p>
            </div>
            <p class='menu-label'>Kategorie</p>

            <ul class='menu-list'>
              <li>
                <a
                  class=''
                  onClick={() => {
                    allList(1)
                  }}
                >
                  Wszystkie
                </a>
              </li>
              <li>
                <a
                  class=''
                  onClick={() => {
                    getList('?category=Planszowe', 1)
                  }}
                >
                  Planszowe
                </a>
              </li>
              <li>
                <a
                  class=''
                  onClick={() => {
                    getList('?category=Karciane', 1)
                  }}
                >
                  Karciane
                </a>
              </li>
              <li>
                <a
                  class=''
                  onClick={() => {
                    getList('?category=Figurkowe', 1)
                  }}
                >
                  Figurkowe
                </a>
              </li>
              <li>
                <a
                  class=''
                  onClick={() => {
                    getList('?category=Akcesoria', 1)
                  }}
                >
                  Akcesoria
                </a>
              </li>
            </ul>
          </aside>

          <div class='container column is-10'>
            {products.map((b) => (
              <div key={b.id} class='columns  box mr-6'>
                <div class='column '>
                  {
                    <Link to={'/' + b.slug}>
                      <div key={b.image}>
                        <figure class='image is-square'>
                          <img src={b.image} alt='#' width='256' />
                        </figure>
                      </div>
                    </Link>
                  }
                </div>

                <div class='column '>
                  <h1 class='title'>{b.name} </h1>
                  <p>{b.description}</p>
                  <br />
                  <strong>Kategorie</strong>
                  {b.category.map((c) => (
                    <div key={c.name}>
                      <p class='has-text-warning-dark'>{c.name}</p>
                    </div>
                  ))}
                  <br />
                  <p class='subtitle has-background-light has-text-centered'>
                    Cena: {b.price} zł
                  </p>
                </div>
              </div>
            ))}

            {searching ? 
            <nav class="pagination " role="navigation" aria-label="pagination">
            {page>1 ? <p class="pagination-previous" onClick={() => {getList(term, page -1)}}>Poprzednia strona</p>:null}
            {page<totalPages ? <p class="pagination-next"onClick={() => {getList(term, page +1)}}>Następna strona</p>:null}
            <ul class="pagination-list"/>  
            </nav>
            : 
            <nav class="pagination " role="navigation" aria-label="pagination">
            {page>1 ? <p class="pagination-previous" onClick={() => {allList(page -1)}}>Poprzednia strona</p>:null}
            {page<totalPages ? <p class="pagination-next"onClick={() => {allList(page +1)}}>Następna strona</p>:null}
            <ul class="pagination-list"/>  
            </nav>
            }

          </div>
        </section>
      </div>
    </div>
  )
}
export default ProductList

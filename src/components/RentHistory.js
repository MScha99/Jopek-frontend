import React, { useState, useEffect } from 'react'
import axios from 'axios'
//lista aktualnie wypożyczonych pozycji 

function RentHistory() {
  const [token] = useState(localStorage.getItem('userToken') ?? null) 
  const [rentlist, setRentList] = useState([]) //lista aktualnie wypożyczonych pozycji pobrana z api
  useEffect(() => {
    axios('http://localhost:8000/profile/', {
      headers: {
        Authorization: 'Token ' + token,
      },
    })
      .then((res) => {
        console.log(res.data)
        setRentList(res.data)
      })
      .catch((error) => {
        console.log(error.response.data.body)
        
      })
  }, [])



  return (
    <div class='column is-three-fifths is-offset-one-fifth '>
      <section class='section box'>
        <h1 class='title '>Twoje aktualne wypożyczenia </h1>
        {rentlist.map((a) => (
          <div key={a.userid}>
            {a.RentProduct.map((b) => (
              <div class='columns is-flex is-vcentered box' key={b.id}>
                <div class='column has-text-centered'>
                  <div>
                    <h2 class='subtitle'>
                      Wypożyczone: <strong>{b.name}</strong> <br />
                      <small>
                       
                        <p>Należy zwrócić przed: {b.renteduntill}</p>
                      </small>
                    </h2>

                    
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  )

}

export default RentHistory
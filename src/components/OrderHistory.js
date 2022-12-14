import React, { useState, useEffect } from 'react'
import axios from 'axios'

//historia zamówień użytkownika 

function OrderHistory() {
  const [token] = useState(localStorage.getItem('userToken') ?? null)
  const [orderlist, setOrderlist] = useState([]) //lista zamówień pobrana z api
  useEffect(() => {
    axios('http://localhost:8000/profile/', {
      headers: {
        Authorization: 'Token ' + token,
      },
    })
      .then((res) => {
        console.log(res.data)
        setOrderlist(res.data)
      })
      .catch((error) => {
        console.log(error.response.data.body)
       
      })
  }, [])



  return (
    <div class='column is-three-fifths is-offset-one-fifth '>
      <section class='section box'>
        <h1 class='title '>Twoja historia zamówień: </h1>
        {orderlist.map((a) => (
          <div key={a.userid}>
            {a.order.map((b) => (
              <div class='columns is-flex is-vcentered box' key={b.id}>
                <div class='column has-text-centered'>
                  <div>
                    <h2 class='subtitle'>
                      Numer id zamówienia: <strong>{b.id}</strong> <br />
                      <small>
                        złożono {b.order_date}
                        <br />
                        <p>Status zamówienia: {b.status}</p>
                      </small>
                    </h2>

                    {b.OrderProduct.map((c) => (
                      <div key={c.id}>
                        <p>
                          <strong>Nazwa produtu: {c.name} </strong>
                          <br />
                          Sztuk: {c.quantity}, cena za sztukę: {c.price}
                          zł
                        </p>
                        <br />
                      </div>
                    ))}
                  </div>
                  <h3 class='subtitle'>
                    Łącznie zapłacono: <strong>{b.price}zł</strong>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  )
}

export default OrderHistory


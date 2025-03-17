import React from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

function DefaultLayout({children}) {
  return (
    <div className="container-fluid p-0" style={{background: `linear-gradient(to bottom, #111111, #000000)`}}>
      <Header/>
      <div className="body-container">{children}</div>
      <Footer/>
    </div>
  )
}
export default DefaultLayout
import React from 'react'
import Header from '../../component/Header/Header'
import Footer from '../../component/Footer/Footer'

function DefaultLayout({children}) {
  return (
    <div className="container-fluid p-0">
      <Header/>
      <div className="body-container">{children}</div>
      <Footer/>
    </div>
  )
}
export default DefaultLayout
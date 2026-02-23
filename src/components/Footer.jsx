import React from 'react'

export default function Footer(){
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Global Esports Calendar. All rights reserved.</p>
      </div>
    </footer>
  )
}

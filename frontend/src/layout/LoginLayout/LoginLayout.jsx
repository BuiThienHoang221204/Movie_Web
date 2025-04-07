import { Container } from 'react-bootstrap'
import React from 'react'

export default function LoginLayout({ children }) {
    return (
        <Container fluid className='p-0'>
            {children}
        </Container>
    )
}

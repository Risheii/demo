import React from 'react'
import { Card } from 'react-bootstrap'

const AppFooter = () => {
    return (
        // make footer with the react-bootstrap
        <>
            <Card className='bg-dark text-white py-4 mt-5'>
                <Card.Body>
                    <Card.Text className='text-center'>&copy; 2026 MyApp. All rights reserved.</Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}

export default AppFooter
import { useRef, useState } from "react"
import { Card, Container } from "react-bootstrap"

const Practice = () => {

    const [Count, setCount] = useState(0)

    const RenderCount = useRef(0)
    RenderCount.current += 1

    const inputref = useRef(null)

    const handleincrement = () => setCount((Count) => Count + 1)
    const handledecrement = () => setCount((Count) => Count - 1)
    const handlereset = () => setCount(0)

    const handleaddclick = () => {
        const val = Number(inputref.current.value)
        if (!val) return
        setCount(Count => Count + val)
        inputref.current.value = ''
        inputref.current.focus()
    }

    return (
        <>
            <Container>
                <Card className="mt-5">
                    <Card.Title className="text-center fs-3 pt-2">
                        Hello World
                    </Card.Title>
                    <Card.Body className="text-center">
                        <p>Count: {Count}</p>
                        <p>This component rendered {RenderCount.current} times</p>
                        <button onClick={handleincrement}>Increment</button>
                        <button onClick={handledecrement} disabled={Count === 0} >Decrement</button>
                        <button onClick={handlereset} disabled={Count === 0}>Reset</button>

                        <div className="pt-5">
                            <input type="number" placeholder="enter nubmer" ref={inputref} />
                            <br />
                            <button className="mt-1" onClick={handleaddclick}>Add</button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}

export default Practice
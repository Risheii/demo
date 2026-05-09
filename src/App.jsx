import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReactBootstrapForm from './component/ReactBootstrapForm'
import Form from './component/Form'
import AppNavbar from './component/Navbar'
import AppFooter from './component/AppFooter'
import ChartPage from './pages/ChartPage'
import Practice from './component/Practice'
import GlobalChatBot from './component/GlobalChatBot'

function App() {

  return (
    <>
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path='/' element={<ReactBootstrapForm />} />
          <Route path='/normal' element={<Form />} />
          <Route path='/chart' element={<ChartPage />} />
          <Route path='/practice' element={<Practice />} />
        </Routes>
        <AppFooter />
        <GlobalChatBot />
      </BrowserRouter>
    </>
  )
}

export default App
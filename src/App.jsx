import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import ReactBootstrapForm from './component/ReactBootstrapForm'
import Form from './component/Form'
import AppNavbar from './component/Navbar'
import AppFooter from './component/AppFooter'
import ChartPage from './pages/ChartPage'
import Practice from './component/Practice'
import GlobalChatBot from './component/GlobalChatBot'
import ChatbotPage from './pages/ChatbotPage'

const Layout = ({ children }) => {
  const location = useLocation()
  const isChatbot = location.pathname === '/chatbot'

  return (
    <>
      {!isChatbot && <AppNavbar />}
      {children}
      {!isChatbot && <AppFooter />}
      {!isChatbot && <GlobalChatBot />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<ReactBootstrapForm />} />
          <Route path='/normal' element={<Form />} />
          <Route path='/chart' element={<ChartPage />} />
          <Route path='/practice' element={<Practice />} />
          <Route path='/chatbot' element={<ChatbotPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
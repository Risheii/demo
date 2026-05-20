import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './store/authSlice'
import ReactBootstrapForm from './component/ReactBootstrapForm'
import Form from './component/Form'
import AppNavbar from './component/Navbar'
import AppFooter from './component/AppFooter'
import ChartPage from './pages/ChartPage'
import Practice from './component/Practice'
import GlobalChatBot from './component/GlobalChatBot'
import ChatbotPage from './pages/ChatbotPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'

import AdminDashboard from './pages/AdminDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import ProtectedRoute from './component/ProtectedRoute'

const Layout = ({ children }) => {
  const location = useLocation()
  const isChatbot = location.pathname.startsWith('/chatbot')

  return (
    <>
      {!isChatbot && <AppNavbar />}
      {children}
      {!isChatbot && <AppFooter />}
      {/* {!isChatbot && <GlobalChatBot />} */}
    </>
  )
}

function App() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path='/' element={<ReactBootstrapForm />} />
          </Route>
          <Route path='/normal' element={<Form />} />
          <Route path='/chart' element={<ChartPage />} />
          <Route path='/practice' element={<Practice />} />
          <Route path='/chatbot' element={<ChatbotPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<ProfilePage />} />
          </Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
          </Route>

          {/* Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route path='/manager/dashboard' element={<ManagerDashboard />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
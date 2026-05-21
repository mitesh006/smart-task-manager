import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';

const router = createBrowserRouter ([
  
  //redirect to auth or dashboard layout
  {
    path: '/',
    element: <Dashboard />,
  },
  // auth layout
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  //Dashboard layout
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/projects',
    element: <ProjectBoard/>
  },
  {
    path: '/projects/:projectID',
    element: <ProjectBoard/>
  },
])


function App() {

      return <RouterProvider router={router} />;
}

export default App

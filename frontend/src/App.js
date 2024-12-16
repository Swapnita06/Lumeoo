import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

function App() {
  return (
    <div>
    <BrowserRouter>
    <Routes>
     <Route exact path="/" element={<Signup />}></Route>
      <Route exact path="/signup" element={<Signup/>}/>
      <Route exact path="/login" element={<Login/>}/>
     </Routes>
     </BrowserRouter>
    </div>

  );
}

export default App;

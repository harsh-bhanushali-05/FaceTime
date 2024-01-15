import Login from './components/Login';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketPro } from "./util/SocketContext.jsx";
import Room from './components/Room';
function App() {
  return (
    <SocketPro>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/room/:roomId' element={<Room />} />
      </Routes>
    </SocketPro>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SplashProvider } from './providers/SplashProvider';
import { Header, Footer } from './components';
import { Home, Register, Vote, Verify, Results, Admin } from './pages';

function App() {
  return (
    <Router>
      <SplashProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/results" element={<Results />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SplashProvider>
    </Router>
  );
}

export default App;

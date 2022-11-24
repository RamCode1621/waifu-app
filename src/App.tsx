import Footer from './components/footer';
import Header from './components/header';
import './components/style/root.css';
import Background from './components/background';


function App() {

  return (
    <div >
      <Header />
      <div className='space '></div>
      <Background />
      <Footer />
    </div>
  );
}

export default App;
import Header from "./components/Header";
import CardGrid from "./components/CardGrid";
import Footer from "./components/Footer";
import "./App.css";

// App is the root component: it just composes Header, CardGrid,
// and Footer.
function App() {
  return (
    <div className="app">
      <Header />
      <CardGrid />
      <Footer />
    </div>
  );
}

export default App;

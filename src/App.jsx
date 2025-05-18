import "./App.css";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { useSmoothScroll } from "./useSmoothScroll";

import ImageGallery from "./new-components/image-gallery";

function App() {
  useSmoothScroll();
  return (
    <main>
      <Navbar />
      <ImageGallery />
      <Footer />
    </main>
  );
}

export default App;

import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./Pages/Home";
import UploadPage from "./Pages/UploadPage";
import BookPage from "./Pages/BookPage"
import ReaderPage from "./Pages/ReaderPage";
function App() {
  return (
    <HashRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/upload"
          element={<UploadPage />}
        />

        <Route
        path="/book/:filename"
        element={<BookPage />}

/>
        <Route
       path="/reader/:filename"
        element={<ReaderPage />}

/>

      </Routes>

    </HashRouter>
  );
}

export default App;
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./Pages/Home";
import UploadPage from "./Pages/UploadPage";
import BookPage from "./Pages/BookPage"
import ReaderPage from "./Pages/ReaderPage";
function App() {
  return (
    <BrowserRouter>

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

    </BrowserRouter>
  );
}

export default App;
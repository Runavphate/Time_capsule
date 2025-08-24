import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import CreateCapsule from "./pages/CreateCapsule.js";
import ViewCapsule from "./pages/ViewCapsule.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCapsule />} />
        <Route path="/capsule/:owner/:id" element={<ViewCapsule />} />
      </Routes>
    </Router>
  );
}

export default App;

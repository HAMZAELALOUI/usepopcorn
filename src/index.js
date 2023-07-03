import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import StarRating from "./StarRating";
function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating onSetRating={setMovieRating} color="blue" maxRating={10} />
      <p>This Movie was Ratrd {movieRating} Stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating maxRating={5} defaultRating={3} />
    <StarRating
      maxRating={3}
      message={["terrible", "bad", "akay", "good", "amazing"]}
      className="test"
    />
    <Test />
  </React.StrictMode>
);

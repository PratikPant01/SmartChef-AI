import { createRoot } from "react-dom/client";
import './App.css';
import Main from "./main"

import Header from "./header"

const root=createRoot(document.getElementById("root"));

root.render(
  <>
    <Header/>
    <Main/>
  </>
);
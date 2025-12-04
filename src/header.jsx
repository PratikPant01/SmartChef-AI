import React from "react";

import chefLogo from "./assets/chef.png";

export default function Header() {
  return (
    <header>
      {/* 2. Use the imported variable as the 'src' */}
      <img src={chefLogo} alt="Cheffff" />
      <h1>Chef Gpt</h1>
    </header>
  );
}

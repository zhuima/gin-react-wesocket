import { useState } from "react";
// https://juejin.cn/post/6844904099624779790
import WaterMark from "watermark-component-for-react";
import Header from "./components/Header";
import Input from "./components/Input";

// import "./App.css";

function App() {
  const content = `Demo演示，请勿喷 `;
  return (
    <div className="App">
      <WaterMark content={content}>
        <Header />

        <Input />
      </WaterMark>
    </div>
  );
}

export default App;

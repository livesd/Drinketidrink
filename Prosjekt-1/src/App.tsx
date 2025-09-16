

import './App.css'
import FilterBar from "./components/FilterBar";

function App() {


  return (
    <>
      <div>
        <h1 className="title">DRINKETIDRINK</h1>
        <FilterBar
          onFiltersChange={({ qName, alc }) => {
            console.log("Search text:", qName);
            console.log("Alcohol filter:", alc);
          }}
        />
      </div>
      <div>


      </div>

    </>
  )
}

export default App

import { useEffect, useState } from 'react'
import './App.css'
const API_KEY = import.meta.env.VITE_APP_API_KEY;


function App() {
  const [list, setList] = useState(null);
  const [vegan, setVegan] = useState(false);

  const [sliderValue, setSliderValue] = useState(250);

  const [search, setSearch] = useState('');
  const [filteredCount, setFilteredCount] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);


  useEffect(() => {
    const fetchAllRecipeData = async () => {
      try{
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=pasta&number=50&addRecipeInformation=true&apiKey=${API_KEY}`);
        if(!response.ok){
          throw new Error('Something went wrong');
        }
        const data = await response.json();
        console.log(data);
        setList(data);
      } catch (error) {
        console.error("Fetching data failed");
      }
    }
    fetchAllRecipeData();
  }, []);

  useEffect(() => {
    if (list) {
      const filtered = list.results.filter(
        item => 
          item.pricePerServing <= sliderValue && 
          item.vegan === vegan && 
          item.title.toLowerCase().includes(search)
      );

      const totalSum = filtered.reduce((total, item) =>{
        return total + (Number(item.pricePerServing) || 0);
      }, 0);

      const avgPrice = filtered.length ? (totalSum / filtered.length): 0;
      setFilteredCount(filtered.length);
      setAveragePrice(avgPrice.toFixed(2));
    }
  }, [list, sliderValue, vegan, search]);
  

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  }

  const HandleVegan = () => {
    setVegan(!vegan);
  }

  const searchItems = (searchValue) => {
    setSearch(searchValue.toLowerCase());
  }

  return (
    <div className='full'>
      <div className='side-bar glow-header'>
        <div className='logo'>
          <h1>🥘Foodies</h1>
          <h2>This site provides a large range of recipes!</h2>
          <h3>Feel free to explore and get to cooking!</h3>
          <br></br>
          <h2>Recipes Listed: {filteredCount}</h2>
          <h2>Todays Recipes: Pasta!</h2>
          <h2>Average Price of Recipes: ${averagePrice}</h2>
        </div>
      </div>
      <div className='info'>
        <div className='glow-header'>
          <h1>Lets learn some pasta recipes!</h1>
          <h3>Here are some recipes that you can make with pasta!</h3>
          <h3>Preferences</h3>
        </div>
        <div className="preferences">
          <div className='name'>
            <h2>Recipe Name:</h2>
            <input
              type='text'
              placeholder = 'Search...'
              onChange = {(inputString) => searchItems(inputString.target.value)}
            />
          </div>
          <div className='vegan'>
            <h2>Vegan:</h2>
            <button onClick={HandleVegan}>{vegan ? 'True' : 'False'}</button>
          </div>
          <div class="slidecontainer">
            <h2>Price: ${sliderValue}</h2>
            <input type="range" min="1" max="500" value={sliderValue} class="slider" id="myRange" onChange={handleSliderChange}></input>
          </div>

        </div>
        <div className='list'>
          <ul>
            {list && list.results.filter(item => item.pricePerServing <=sliderValue && item.vegan==vegan && item.title.toLowerCase().includes(search)).map((item) => (
              <li className='no-bullets' key={item.id}>
                <div className='display'>
                  <h3>{item.title}</h3>
                  <h3>Vegan: {item.vegan ? 'True' : 'False'}</h3>
                  <h3>Price: {item.pricePerServing}</h3>
                  <img src={item.image} alt={item.title} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App

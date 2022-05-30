import Header from "./components/Header";
import Drawer from "./components/Drawer";
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
// const arr = [
//   {
//     name: "Мужские Кроссовки Nike Blazer Mid Suede",
//     price: 12999,
//     imageUrl: "./img/sneakers/1.jpg",
//   },
//   {
//     name: "Мужские Кроссовки Nike Air Max 270",
//     price: 15600,
//     imageUrl: "./img/sneakers/2.jpg",
//   },
//   {
//     name: "Мужские Кроссовки Nike Blazer Mid Suede",
//     price: 8499,
//     imageUrl: "./img/sneakers/3.jpg",
//   },
//   {
//     name: "Кроссовки Puma X Aka Boku Future Rider",
//     price: 8999,
//     imageUrl: "./img/sneakers/4.jpg",
//   },
//   {
//     name: "Мужские Кроссовки Under Armour Curry 8",
//     price: 15199,
//     imageUrl: "./img/sneakers/5.jpg",
//   },
//   {
//     name: "Мужские Кроссовки Nike Kyrie 7",
//     price: 111299,
//     imageUrl: "./img/sneakers/6.jpg",
//   },
//   {
//     name: "Мужские Кроссовки Jordan Air Jordan 11",
//     price: 10799,
//     imageUrl: "./img/sneakers/7.jpg",
//   },
//   {
//     name: "Мужские Кроссовки Nike LeBron XVIII",
//     price: 16499,
//     imageUrl: "./img/sneakers/8.jpg",
//   },
//   {
//     name: "Мужские Кроссовки Nike Lebron XVIII Low",
//     price: 13999,
//     imageUrl: "./img/sneakers/9.jpg",
//   },
//   {
//     name: "Мужские Кроссовки Nike Blazer Mid Suede",
//     price: 8499,
//     imageUrl: "./img/sneakers/10.jpg",
//   },
//   {
//     name: "Кроссовки Puma X Aka Boku Future Rider",
//     price: 8999,
//     imageUrl: "./img/sneakers/11.jpg",
//   },
//   {
//     name: "Мужские Кроссовки Nike Kyrie Flytrap IV",
//     price: 11299,
//     imageUrl: "./img/sneakers/12.jpg",
//   },
// ];

export const AppContext = createContext({});

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartOpened, setCartOpened] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fetch("https://628b819f7886bbbb37b9b01b.mockapi.io/items")
    //   .then((res) => {
    //     return res.json(); //поулчение массива из удаленного сервера,работает так же как и axios
    //   })
    //   .then((json) => {
    //     setItems(json);
    //   });
    async function fetchData() {
      const cartResponse = await axios.get(
        "https://628b819f7886bbbb37b9b01b.mockapi.io/Cart"
      );
      const favoriteResponse = await axios.get(
        "https://628b819f7886bbbb37b9b01b.mockapi.io/favorites"
      );
      const itemsResponse = await axios.get(
        "https://628b819f7886bbbb37b9b01b.mockapi.io/items"
      );
      setIsLoading(false);
      setItems(itemsResponse.data);
      setCartItems(cartResponse.data); //Получение добавленных в корзину объектов из сервера в корзину
      setFavorites(favoriteResponse.data); //Получение добавленных в корзину объектов из сервера в корзину
    }

    fetchData();
  }, []); // Если ничего не указывать - хук отработает только один раз при рендере App
  // Так же в useEffect можно указать в кв. скобках после чего функция в хуке будет выполняться,например,после изменения какого-нибудь стейта

  const onAddToCart = (obj) => {
    // setCartItems([...cartItems, obj]); //нельзя мутировать массив
    if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
      axios.delete(
        `https://628b819f7886bbbb37b9b01b.mockapi.io/Cart/${obj.id}`
      ); 

      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(obj.id))
      ); //нельзя мутировать массив
      //Получаем предыдущее значение массива и проверяем - если хотя бы один объект из стейта содержит obj.id, то исключи его из этого массива
    } else {
      axios.post("https://628b819f7886bbbb37b9b01b.mockapi.io/Cart", obj); //Добавленные items в корзину летят на сервер
      setCartItems((prev) => [...prev, obj]);
    }
  };

  const onRemoveItem = (id) => {
    axios.delete(`https://628b819f7886bbbb37b9b01b.mockapi.io/Cart/${id}`); 
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) == Number(obj.id))) {
        axios.delete(
          `https://628b819f7886bbbb37b9b01b.mockapi.io/favorites/${obj.id}`
        );
        setFavorites((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        const { data } = await axios.post(
          "https://628b819f7886bbbb37b9b01b.mockapi.io/favorites",
          obj
        ); //Добавленные items в корзину летят на сервер
        // setCartItems([...cartItems, obj]); //нельзя мутировать массив
        setFavorites((prev) => [...prev, data]); //нельзя мутировать массив
      }
    } catch (error) {
      alert("Не удалось добавить в Закладки");
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.id) === Number(id));
  };

  return (
    <AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, setCartOpened, setCartItems }}>
      <div className="wrapper clear">
        {cartOpened && (
          <Drawer
            items={cartItems}
            onClose={() => setCartOpened(false)}
            onRemove={onRemoveItem}
          />
        )}
        <Header onClickCart={setCartOpened} />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToCart={onAddToCart}
                onAddToFavorite={onAddToFavorite}
                isLoading={isLoading}
              />
            }
          ></Route>
          <Route
            path="/favorites"
            exact
            element={<Favorites onAddToFavorite={onAddToFavorite} />}
          ></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;

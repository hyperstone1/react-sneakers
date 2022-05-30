import { AppContext } from "../App";
import { useContext } from "react";
import Card from "../components/Card/Card";

function Favorites({ onAddToFavorite }) {
  const { favorites } = useContext(AppContext);
  return (
    <div className="content p-40">
      <div className="d-flex align-center mb-40 justify-between">
        <h1 className="">Мои закладки</h1>
      </div>
      <div className="d-flex flex-wrap">
        {favorites.map((item, index) => (
          <Card
            key={index}
            favorited={true}
            onFavorite={onAddToFavorite}
            {...item} // Передает все свойства item в Card
          />
        ))}
      </div>
    </div>
  );
}
export default Favorites;

import { Link } from 'react-router-dom';
import { medicines } from '../data/medicines';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  const count = medicines.filter(m => m.category === category.id).length;

  return (
    <Link
      to={`/products?category=${category.id}`}
      className="category-card"
      id={`category-${category.id}`}
    >
      <div
        className="category-card__icon"
        style={{ backgroundColor: category.color + '18' }}
      >
        {category.icon}
      </div>
      <span className="category-card__name">{category.name}</span>
      <span className="category-card__count">{count} products</span>
    </Link>
  );
};

export default CategoryCard;

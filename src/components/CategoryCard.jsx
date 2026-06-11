import { Link } from 'react-router-dom';
import { products as medicines } from '../data/products';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  const count = category.id === 'All Categories'
    ? medicines.length
    : medicines.filter(m => m.category === category.id).length;

  return (
    <Link
      to={`/products?category=${category.id}`}
      className="category-card"
      id={`category-${category.id}`}
    >
      <div
        className="category-card__icon"
        style={{ backgroundColor: category.color + '18', color: category.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}
      >
        {category.name.charAt(0)}
      </div>
      <span className="category-card__name">{category.name}</span>
      <span className="category-card__count">{count} products</span>
    </Link>
  );
};

export default CategoryCard;

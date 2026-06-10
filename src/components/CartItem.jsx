import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { categories } from '../data/medicines';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const categoryData = categories.find(c => c.id === item.category);
  const effectivePrice = item.price;

  return (
    <div className="cart-item" id={`cart-item-${item.id}`}>
      <div className="cart-item__image-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '4px', width: '60px', height: '60px', flexShrink: 0 }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#888' }}>{item.name.charAt(0)}</span>
      </div>

      <div className="cart-item__info">
        <h4 className="cart-item__name">{item.name}</h4>
        <p className="cart-item__meta">{item.manufacturer} · {item.packSize}</p>
        <div className="cart-item__price-row">
          <span className="cart-item__price">{formatPrice(effectivePrice)}</span>
        </div>
      </div>

      <div className="cart-item__controls">
        <div className="cart-item__qty">
          <button
            className="cart-item__qty-btn"
            onClick={() => item.quantity <= 1 ? removeFromCart(item.id) : updateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="cart-item__qty-value">{item.quantity}</span>
          <button
            className="cart-item__qty-btn"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <span className="cart-item__subtotal">
          {typeof effectivePrice === 'string' ? effectivePrice : formatPrice(effectivePrice * item.quantity)}
        </span>

        <button
          className="cart-item__remove"
          onClick={() => removeFromCart(item.id)}
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

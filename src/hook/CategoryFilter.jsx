export default function CategoryFilter({ active, setActive }) {
    const categories = ["gold", "diamonds", "care", "jewelry", "luxury"];
  
    return (
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={active === cat ? "active" : ""}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }
  
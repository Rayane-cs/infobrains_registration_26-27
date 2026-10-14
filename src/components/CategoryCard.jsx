import React from 'react';
import { ArrowRight, Brain, Check, Clapperboard, Code2, Cpu, ShieldCheck, Smartphone } from 'lucide-react';
import { Link } from '../router.jsx';

const iconMap = {
  Brain,
  Clapperboard,
  Code2,
  Cpu,
  ShieldCheck,
  Smartphone,
};

export default function CategoryCard({ category, selected, maxReached, selectionOrder, onToggle }) {
  const Icon = iconMap[category.icon] ?? Code2;

  let cardClasses = 'category-card';
  if (selected) cardClasses += ' category-card--selected';
  else if (maxReached) cardClasses += ' category-card--max-reached';

  let stateLabel = 'Select for Multi-Track';
  if (selected) {
    stateLabel = selectionOrder ? `Selected (Track ${selectionOrder}/2)` : 'Selected for Multi-Track';
  } else if (maxReached) {
    stateLabel = 'Max 2 Tracks Reached';
  }

  return (
    <div
      className={cardClasses}
      style={{ '--category-color': category.color }}
    >
      <label className="category-card__clickable-area">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(category.id)}
          aria-describedby={`${category.id}-description`}
        />
        <span className="category-card__top">
          <span className="category-icon">
            <Icon size={24} aria-hidden="true" />
          </span>
          <span className="category-check" aria-hidden="true">
            {selected ? <Check size={18} /> : null}
          </span>
        </span>
        <span className="category-card__name">{category.name}</span>
        <span className="category-card__description" id={`${category.id}-description`}>
          {category.description}
        </span>
        <span className={`category-card__state ${maxReached && !selected ? 'category-card__state--limit' : ''}`}>
          {stateLabel}
        </span>
      </label>

      <div className="category-card__actions">
        <Link
          to={category.route}
          className="category-card__track-link"
          aria-label={`Register specifically for ${category.name}`}
        >
          <span>Register in {category.shortName} Track</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

import React from 'react';
import { Pill, Droplets, Candy, Droplet, Syringe, Stethoscope, FlaskConical, Beaker } from 'lucide-react';

const iconMap = {
  Pill: Pill,
  Droplets: Droplets,
  Candy: Candy,
  Droplet: Droplet,
  Syringe: Syringe,
  Stethoscope: Stethoscope,
  FlaskConical: FlaskConical,
  Beaker: Beaker,
};

export const CategoryIcon = ({ name, size = 24, className = "" }) => {
  const IconComponent = iconMap[name] || Pill;
  return <IconComponent size={size} className={className} />;
};

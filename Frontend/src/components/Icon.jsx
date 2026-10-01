import React from 'react';
import * as Icons from '../assets/assets';

/**
 * Master Icon Wrapper Component
 * Usage: <Icon name="SunIcon" className="w-5 h-5 text-gray-500" />
 */
const Icon = ({ name, className = "", ...props }) => {
  const SvgIcon = Icons[name];

  if (!SvgIcon) {
    console.warn(`Icon "${name}" not found in assets!`);
    return null;
  }

  return <SvgIcon className={className} {...props} />;
};

export default Icon;

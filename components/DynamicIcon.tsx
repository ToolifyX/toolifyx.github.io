"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps extends LucideIcons.LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

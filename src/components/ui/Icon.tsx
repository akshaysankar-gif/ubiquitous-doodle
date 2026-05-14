import React from "react";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

export interface IconProps extends LucideProps {
  name: keyof typeof LucideIcons;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = LucideIcons[name] as React.ElementType;
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
};

export default Icon;

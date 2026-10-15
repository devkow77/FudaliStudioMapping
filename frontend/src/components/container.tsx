import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: Props) => {
  return <div className={twMerge("mx-auto px-6", className)}>{children}</div>;
};

export default Container;

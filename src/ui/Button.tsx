import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="p-1 border bg-gray-200 hover:bg-gray-100 cursor-pointer disabled:cursor-default disabled:hover:bg-gray-200"
    >
      {children}
    </button>
  );
}

// src/components/Navbar.tsx
import Link from "next/link";
import CartIcon from "./CartIcon";

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-800">
            EPIC.SUPPLY
        </Link>
        <nav>
            <CartIcon />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

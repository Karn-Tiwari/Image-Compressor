import { Link, NavLink } from "react-router-dom";
import LogoURL from "../../img/ImageCompressorLogo.png";

export default function Header() {
  return (
    <header className="shadow sticky z-50 top-0 gradient-header">
      <nav className="border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img src={LogoURL} className="mr-3 h-12" alt="Logo" />
          </Link>
          <div className="flex-grow text-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 font-bold text-4xl ${
                  isActive ? "text-black" : "text-black"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              Image Compressor
            </NavLink>
          </div>
          <div
            className="hidden lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            {/* Additional navigation items can be added here if needed */}
          </div>
        </div>
      </nav>
    </header>
  );
}

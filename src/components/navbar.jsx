"use client";
import Link from "next/link";
import React, { useState } from "react";
import { ModeToggle } from "./togglebutton";
import { LogOut, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Cookies from "js-cookie";
import { logoutSuccess } from "@/redux/reducer/userReducer";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const { isAuth, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const logoutHandler = () => {
    Cookies.remove("token");
    toggleMenu();
    dispatch(logoutSuccess());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(search)}`);
      // setSearch("");
      setIsOpen(false); 
    }
  };

  return (
    <nav className="z-50 sticky top-0 bg-background/50 border-b backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={"/"} className="text-xl font-bold">
              <span className="text-4xl">Next</span>
              <span className="text-4xl text-blue-500">Job</span>
            </Link>
          </div>
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center mr-4">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-l px-3 py-1 focus:outline-none"
            />
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-r">Search</button>
          </form>
          <div className="hidden md:flex space-x-4 items-center">
            <Link href={"/"} className="hover:text-gray-600">
              Home
            </Link>
            <Link href={"/jobs"} className="hover:text-gray-600">
              Jobs
            </Link>
            <Link href={"/about"} className="hover:text-gray-600">
              About
            </Link>
            {isAuth ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={user && user.profilePic}
                      alt={user && user.name}
                    />
                    <AvatarFallback>
                      {user && user.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <Button className="w-full" variant="outline">
                    <Link href="/account">Profile</Link>
                  </Button>
                  <Button
                    className="w-full flex justify-center items-center gap-2 mt-2"
                    variant="destructive"
                    onClick={logoutHandler}
                  >
                    Logout <LogOut size={18} />
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Link href={"/login"} className="hover:text-gray-600">
                Login
              </Link>
            )}
            <div>
              <ModeToggle />
            </div>
          </div>
          <div className="md:hidden">
            <ModeToggle />
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="mobile-menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <form onSubmit={handleSearchSubmit} className="flex items-center justify-center mb-2">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-l px-3 py-1 focus:outline-none w-2/3"
          />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-r">Search</button>
        </form>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
          <Link
            href={"/"}
            onClick={toggleMenu}
            className="block hover:bg-gray-300 px-3 py-2 rounded-md"
          >
            Home
          </Link>
          <Link
            href={"/jobs"}
            onClick={toggleMenu}
            className="block hover:bg-gray-300 px-3 py-2 rounded-md"
          >
            Jobs
          </Link>
          <Link
            href={"/about"}
            onClick={toggleMenu}
            className="block hover:bg-gray-300 px-3 py-2 rounded-md"
          >
            About
          </Link>
          {isAuth ? (
            <>
              <Link
                href={"/account"}
                onClick={toggleMenu}
                className="block hover:bg-gray-300 px-3 py-2 rounded-md"
              >
                Account
              </Link>

              <Button
                className="flex w-full justify-center items-center gap-2 mt-1"
                variant="destructive"
                onClick={logoutHandler}
              >
                Logout <LogOut size={18} />
              </Button>
            </>
          ) : (
            <Link
              href={"/login"}
              onClick={toggleMenu}
              className="block hover:bg-gray-300 px-3 py-2 rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

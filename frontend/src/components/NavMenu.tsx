import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { AcmeLogo } from "../assets/AcmeLogo.jsx";
import { Button } from "./ui/button.js";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/index.js";

export function NavMenu() {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore((state) => state);

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setUser({
        user: {
          name: undefined,
          image: undefined,
          token: undefined,
        },
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar isBordered maxWidth="xl">
      <NavbarContent justify="center">
        <NavbarBrand className="mr-4">
          <AcmeLogo />
          <p className="hidden sm:block font-bold text-inherit">CodeColiseum</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="center">
        {user.name && user.token ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={user.image}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.name}</p>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={logout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button className="bg-sky-800" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
}

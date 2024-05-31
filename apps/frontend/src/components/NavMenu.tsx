import React from "react";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AcmeLogo } from "./../assets/AcmeLogo";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/index.js";
import { Button } from "./ui/button";

export function NavMenu() {
  const navigate = useNavigate();
  const { user, logOut } = useUserStore((state) => state);

  return (
    <Navbar className="py-2 px-40 shadow-md bg-white">
      <NavbarBrand>
        <AcmeLogo />
        <p className="hidden sm:block font-bold text-inherit">CodeColiseum</p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        {user?.name && user?.token ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className=" cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.name}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span onClick={() => logOut()}>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="bg-sky-800" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
}

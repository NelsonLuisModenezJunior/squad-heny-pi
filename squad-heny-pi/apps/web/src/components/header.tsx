"use client";

import React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Relatórios", href: "/relatorio" },
  { name: "FAQ", href: "/faq" },
  { name: "Sobre nós", href: "/sobre" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // autenticação simples baseada no token salvo pela sua tela de login (localStorage)
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsAuthenticated(!!localStorage.getItem("token"));
    check();

    // atualiza quando outra aba muda o token
    const onStorage = () => check();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      // logout simples
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      window.location.href = "/";
    } else {
      // abre sua tela de login
      window.location.href = "/login";
    }
  };

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item) => (
                  <li key={`${item.href}-${item.name}`}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/80 hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* botão Entrar / Logout */}
            <div className="hidden lg:flex lg:items-center">
              <button
                onClick={handleAuthClick}
                className="rounded-md bg-gradient-to-r from-[#79BA92] to-[#51A471] px-4 py-2 text-sm font-medium text-white shadow-lg hover:scale-105 transition"
              >
                {isAuthenticated ? "Logout" : "Entrar"}
              </button>
            </div>

            {/* mobile menu panel */}
            {menuState && (
              <div className="lg:hidden absolute inset-x-2 top-full mt-2 rounded-xl bg-background/60 p-4 backdrop-blur-md shadow-lg">
                <ul className="flex flex-col gap-3">
                  {menuItems.map((item) => (
                    <li key={`${item.href}-${item.name}`}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="block px-3 py-2 rounded-md"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => {
                        handleAuthClick();
                        setMenuState(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md"
                    >
                      {isAuthenticated ? "Logout" : "Entrar"}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

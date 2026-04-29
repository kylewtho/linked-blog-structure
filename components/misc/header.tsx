import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Search from "./search";
import Transition from "../utils/transitions";
import { BLOG_CONFIG } from "../../lib/config";

function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch (_e) {
      // ignore
    }
  };

  return { dark, toggle };
}

const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [top, setTop] = useState(true);
  const [searching, setSearching] = useState(false);
  const { dark, toggle: toggleDark } = useDarkMode();

  const trigger = useRef(null);
  const mobileNav = useRef(null);

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!mobileNav.current || !trigger.current) return;
      if (
        !mobileNavOpen ||
        mobileNav.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setMobileNavOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [mobileNavOpen]);

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [mobileNavOpen]);

  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <header
      className={`fixed w-full z-30 md:bg-white/90 dark:md:bg-zinc-900/90 transition duration-300 ease-in-out ${!top && "bg-white dark:bg-zinc-900 backdrop-blur-sm shadow-border"}`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link href="/" className="block" aria-label={BLOG_CONFIG.title}>
              <Image
                className="w-8 h-8"
                src="/assets/logo.png"
                width={32}
                height={32}
                alt="Logo"
              />
            </Link>
          </div>

          {/* Site name */}
          <h2 className="shrink-0 mr-4 text-2xl font-semibold tracking-tight md:tracking-tighter leading-tight">
            <Link
              href="/"
              className="block hover:underline"
              aria-label={BLOG_CONFIG.title}
            >
              {BLOG_CONFIG.title}
            </Link>
          </h2>

          {/* Desktop navigation */}
          <ul className="flex grow justify-end flex-wrap items-center">
            <nav className="hidden md:flex md:grow">
              {/* Desktop menu links */}
              <ul className="flex grow mr-4 justify-end flex-wrap items-center">
                {BLOG_CONFIG.navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/*Mobile navigation */}
            <div ref={mobileNav}>
              <Transition
                show={mobileNavOpen}
                tag="nav"
                id="mobile-nav"
                className="absolute top-full h-screen pb-16 z-20 left-0 w-full overflow-scroll bg-white dark:bg-zinc-900"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
                appear={undefined}
              >
                <div className="px-5 pt-4 pb-2">
                  {/* Search input */}
                  <div className="relative flex items-center mb-4">
                    <input
                      type="search"
                      placeholder="Search my notes"
                      onFocus={() => {
                        setSearching(true);
                        setMobileNavOpen(false);
                      }}
                      className="w-full text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 placeholder-gray-400 dark:placeholder-gray-500 rounded px-3 py-2 pl-9 text-sm focus:outline-none"
                      readOnly={true}
                    />
                    <svg
                      className="absolute left-3 w-4 h-4 fill-current text-gray-400"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zM15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                    </svg>
                  </div>

                  {/* Nav links + dark mode row */}
                  <ul>
                    {BLOG_CONFIG.navLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                    <li className="border-t border-gray-200 dark:border-zinc-700 mt-2 pt-2">
                      <button
                        type="button"
                        onClick={toggleDark}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 w-full"
                      >
                        {dark ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71m12.02 0-.71-.71M6.34 6.34l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                            />
                          </svg>
                        )}
                        {dark ? "Light mode" : "Dark mode"}
                      </button>
                    </li>
                  </ul>
                </div>
              </Transition>
            </div>
            {/* Hamburger button (mobile only) */}
            <li className="md:hidden">
              <button
                type="button"
                ref={trigger}
                className={`hamburger w-8 h-8 my-auto mx-1 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition ${mobileNavOpen && "active"}`}
                aria-controls="mobile-nav"
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                <span className="sr-only">Menu</span>
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect y="2" width="20" height="2" rx="1" />
                  <rect y="9" width="20" height="2" rx="1" />
                  <rect y="16" width="20" height="2" rx="1" />
                </svg>
              </button>
            </li>

            {/* Dark mode toggle (desktop only) */}
            <li className="hidden md:flex">
              <button
                type="button"
                className="w-8 h-8 my-auto mx-1 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition"
                aria-label={
                  dark ? "Switch to light mode" : "Switch to dark mode"
                }
                onClick={toggleDark}
              >
                {dark ? (
                  /* Sun icon */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71m12.02 0-.71-.71M6.34 6.34l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z"
                    />
                  </svg>
                ) : (
                  /* Moon icon */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                    />
                  </svg>
                )}
              </button>
            </li>
            {/* Search button (desktop only) */}
            <li className="hidden md:flex">
              <button
                type="button"
                className="w-8 h-8 my-auto mx-1 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition"
                aria-label="Search"
                onClick={() => setSearching(!searching)}
                disabled={searching}
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zM15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </li>
          </ul>
          {/* Search */}
          <Search visible={searching} setVisible={setSearching} />
        </div>
      </div>
    </header>
  );
};

export default Header;

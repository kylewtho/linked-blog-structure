import Link from 'next/link'
import { useEffect, useState, useRef } from 'react';
import Search from './search';
import Transition from '../utils/transitions';

const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [top, setTop] = useState(true);
  const [searching, setSearching] = useState(false);

  const trigger = useRef(null);
  const mobileNav = useRef(null);

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!mobileNav.current || !trigger.current) return;
      if (!mobileNavOpen || mobileNav.current.contains(target) || trigger.current.contains(target)) return;
      setMobileNavOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // detect whether user has scrolled the page down by 10px 
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true)
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);  

  return (
    <header className={`fixed w-full z-30 md:bg-white/90 transition duration-300 ease-in-out ${!top && 'bg-white backdrop-blur-sm shadow-lg'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link href="/" className="block" aria-label="Fleeting Notes">
              <img className="w-8 h-8" src="/assets/logo.png"/>
            </Link>
          </div>

          {/* Site name */}
          <h2 className="shrink-0 mr-4 text-2xl font-bold tracking-tight md:tracking-tighter leading-tight">
            <Link href="/" className="block hover:underline" aria-label="Kyle">
              Kyle
            </Link>
          </h2>

          {/* Desktop navigation */}
          <ul className="flex grow justify-end flex-wrap items-center">
            <nav className="hidden md:flex md:grow">
              {/* Desktop menu links */}
              <ul className="flex grow mr-4 justify-end flex-wrap items-center">
                <li>
                  <Link href="https://kyleho.net" className="text-gray-600 hover:text-gray-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">About</Link>
                </li>      
                <li>
                  <Link href="https://blog.kyleho.net" className="text-gray-600 hover:text-gray-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">Blog</Link>
                </li>
                <li>
                  <Link href="https://project.kyleho.net" className="text-gray-600 hover:text-gray-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">Projects</Link>
                </li>    
                <li>
                  <Link href="https://cv.kyleho.net" className="text-gray-600 hover:text-gray-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">Resume</Link>
                </li>    
              </ul>
            </nav>

          {/*Mobile navigation */}
            <div ref={mobileNav}>
              <Transition
                  show={mobileNavOpen}
                  tag="nav"
                  id="mobile-nav"
                  className="absolute top-full h-screen pb-16 z-20 left-0 w-full overflow-scroll bg-white"
                  enter="transition ease-out duration-200 transform"
                  enterStart="opacity-0 -translate-y-2"
                  enterEnd="opacity-100 translate-y-0"
                  leave="transition ease-out duration-200"
                  leaveStart="opacity-100"
                  leaveEnd="opacity-0"
                  appear={undefined}
                  >
                <ul className="px-5 py-2">
                  <li>
                    <Link href="https://kyleho.net" className="flex text-gray-600 hover:text-gray-900 py-2">About</Link>
                  </li>     
                  <li>
                    <Link href="https://blog.kyleho.net" className="flex text-gray-600 hover:text-gray-900 py-2">Blog</Link>
                  </li>
                  <li>
                    <Link href="https://project.kyleho.net" className="flex text-gray-600 hover:text-gray-900 py-2">Project</Link>
                  </li>
                  <li>
                    <Link href="https://cv.kyleho.net" className="flex text-gray-600 hover:text-gray-900 py-2">Resume</Link>
                  </li>
                  <li>
                    <button onClick={() => {setSearching(true); setMobileNavOpen(false);}} className="flex text-gray-600 hover:text-gray-900 py-2 w-full">Search</button>
                  </li>                                  
                </ul>
              </Transition>
            </div>
          {/* Search button */}
            <li>
              <button className="w-4 h-4 my-auto mx-2 border-black" aria-label="Search" onClick={() => setSearching(!searching)} disabled={searching}>
                <svg className="w-4 h-4fill-current text-gray-400" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zM15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </li>
          </ul>
          {/* Search */}
          <Search visible={searching} setVisible={setSearching}/>
        </div>
      </div>
    </header>
  )
}

export default Header

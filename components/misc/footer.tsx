import Link from 'next/link';
import React from 'react';
import { BLOG_CONFIG } from '../../lib/config';

function Footer() {
  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'github':
        return (
          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1.1.1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
          </svg>
        );
      case 'mastodon':
        return (
          <svg className="w-8 h-8 fill-current" viewBox="-10 -10 42 42" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.303 7.758.148 10.33.148 13.41c0 1.126.073 2.235.147 3.307.274 3.99 2.762 5.846 6.264 6.334 1.99.272 3.846.333 5.39.308 3.33-.053 5.05-.538 5.05-.538l-.138-2.14s-2.138.582-4.723.619c-2.552.038-4.046-.271-4.586-.517-.694-.313-1.479-1.062-1.634-2.503-.018-.165-.034-.331-.044-.497.63.158 1.222.267 1.843.332 2.361.246 4.62.113 6.941-.096 2.747-.246 4.908-.907 5.614-2.774.23-.6.429-1.396.429-2.456 0-3.136-.153-5.853-.733-8.254zm-4.597 7.515h-2.393V7.445c0-.616-.287-1.11-.887-1.11-.573 0-.88.477-.88 1.11v4.474h-2.393V7.445c0-.616-.287-1.11-.887-1.11-.573 0-.88.477-.88 1.11v5.383h-2.393V7.078c0-1.266.545-2.467 2.1-2.467 1.05 0 1.807.526 2.112 1.276l.419.81.418-.81c.305-.75 1.062-.75 2.112-1.276 1.555 0 2.1 1.201 2.1 2.467v5.75z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-8 h-8 fill-current" viewBox="-10 -10 42 42" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'x':
      case 'twitter':
        return (
          <svg className="w-8 h-8 fill-current" viewBox="-10 -10 42 42" xmlns="http://www.w3.org/2000/svg" >
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 fill-current" viewBox="-5 -5 22 22" xmlns="http://www.w3.org/2000/svg">
            <path d="M7,1V5h4V1Zm3,3H8V2h2ZM7,7v4h4V7Zm3,3H8V8h2ZM1,1V5H5V1ZM4,4H2V2H4ZM1,7v4H5V7Zm3,3H2V8H4Z" />
          </svg>
        );
    }
  };

  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
          {/* Copyrights note */}
          <div className="text-sm text-gray-600 mr-4">
            &copy; {new Date().getFullYear()} {BLOG_CONFIG.title}. All rights reserved.
          </div>

          {/* Social links */}
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
            {BLOG_CONFIG.footerLinks.map((link, index) => (
              <li key={link.name} className={index > 0 ? 'ml-4' : ''}>
                <Link 
                  href={link.href} 
                  className="flex justify-center items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full shadow transition duration-150 ease-in-out"
                  aria-label={link.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getSocialIcon(link.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

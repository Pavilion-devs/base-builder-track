'use client';

import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { WalletConnect } from '@/components/ui';

export interface NavigationProps {
  logo?: string;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  logo = 'TABSY',
  className
}) => {
  return (
    <nav className={clsx(
      'fixed z-50 bg-white/80 border-neutral-200 border-b',
      'top-0 right-0 left-0 backdrop-blur-sm',
      className
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
            >
              {logo}
              <span className="align-super text-[0.6em] font-medium ml-1">™</span>
            </Link>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="hover:text-neutral-900 transition-colors text-sm font-medium text-neutral-600 tracking-tight"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-neutral-900 transition-colors text-sm font-medium text-neutral-600 tracking-tight"
              >
                Dashboard
              </Link>
              <Link
                href="/#features"
                className="hover:text-neutral-900 transition-colors text-sm font-medium text-neutral-600 tracking-tight"
              >
                Features
              </Link>
            </div>
          </div>

          {/* Right Side - Wallet Connect */}
          <div className="flex items-center gap-4">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

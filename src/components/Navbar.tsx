'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowArcLeftIcon, GithubLogoIcon } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white font-two dark:bg-black backdrop-blur">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-mygitwrap.png"
              alt="MyGitWrap logo"
              width={32}
              height={32}
            />
            <span className="text-lg items-center font-semibold text-gray-900 dark:text-white">
              MyGitWrap
            </span>
          </Link>

          <Button
            asChild
            variant="default"
            size="sm"
            className="
              flex items-center gap-2
             bg-linear-to-b from-[#050112] to-[#03010d]
              px-4 py-2 rounded-xl text-white
              font-medium font-two
              shadow-[0,4px,4px_rgba(0,10,31,0.25)]
              gradient-stroke cursor-pointer"
          >
            <Link href="https://github.com/ankitkarki27/MyGitWrap">
              <GithubLogoIcon size={32} />
              Github
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
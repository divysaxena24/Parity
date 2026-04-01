"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Mail } from "lucide-react";
import { GithubIcon, XIcon, InstagramIcon } from "@/components/ui/SocialIcons";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) return null;

  const sections = [
    {
      title: "Platform",
      links: [
        { name: "How it Works", href: "/how-it-works" },
        { name: "Pricing", href: "/pricing" },
        { name: "Impact Partners", href: "/charities" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Login", href: "/login" },
        { name: "Sign Up", href: "/signup" },
      ],
    }
  ];

  return (
    <footer className="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white transition-transform group-hover:scale-110">
                <Trophy size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Parity</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Track your golf performance, support life-changing charities, and enter monthly draws to win impactful prizes. Play with purpose.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <SocialLink href="#" icon={<XIcon size={18} />} />
              <SocialLink href="#" icon={<InstagramIcon size={18} />} />
              <SocialLink href="#" icon={<GithubIcon size={18} />} />
              <SocialLink href="#" icon={<Mail size={18} />} />
            </div>
          </div>
          
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-500"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold italic opacity-80">
            © {currentYear} Parity Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      className="text-slate-400 transition-all hover:scale-110 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-500"
    >
      {icon}
    </a>
  );
}

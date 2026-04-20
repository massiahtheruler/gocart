"use client";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  ArrowRight,
  PackageIcon,
  PlusCircle,
  Search,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = useSelector((state) => state.cart.total);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userButtonAppearance = {
    elements: {
      userButtonTrigger: "clerk-user-trigger",
      userButtonAvatarBox: "clerk-user-avatar",
      userButtonPopoverCard: "clerk-user-popover",
      userButtonPopoverMain: "clerk-user-main",
      userButtonPopoverActions: "clerk-user-actions",
      userButtonPopoverActionButton: "clerk-user-action",
      userButtonPopoverActionButtonText: "clerk-user-action-label",
      userButtonPopoverActionButtonIcon: "clerk-user-action-icon",
      userButtonPopoverFooter: "clerk-user-footer",
      userPreview: "clerk-user-preview",
      userPreviewMainIdentifier: "clerk-user-preview-name",
      userPreviewSecondaryIdentifier: "clerk-user-preview-email",
    },
  };

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/70 bg-white/52 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="mx-4 sm:mx-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-4 transition-all">
          <Link
            href="/"
            className={`group relative shrink-0 text-3xl font-semibold tracking-[-0.06em] text-slate-800 transition-transform duration-200 hover:-translate-y-0.5 sm:text-4xl ${
              isScrolled ? "" : "logo-pedestal"
            }`}
          >
            <span className="text-emerald-700 transition-colors group-hover:text-emerald-600">
              go
            </span>
            cart
            <span className="text-emerald-700 text-5xl leading-none">.</span>
            <Show when={{ plan: "plus" }}>
              <p className="absolute -right-8 -top-1 flex items-center rounded-full border border-emerald-200/80 bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_28px_rgba(5,150,105,0.32)]">
                +plus
              </p>
            </Show>
          </Link>

          <div className="hidden items-center gap-4 sm:flex lg:gap-7">
            <div className="relative flex items-center gap-2 rounded-full border border-white/72 bg-white/72 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.86),0_18px_32px_rgba(71,85,105,0.12)] backdrop-blur-md before:pointer-events-none before:absolute before:inset-[1px] before:rounded-full before:border before:border-white/55 before:opacity-80">
              <Link
                href="/"
                className="nav-link-soft rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/80 hover:text-slate-900"
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="nav-link-soft rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/80 hover:text-slate-900"
              >
                Shop
              </Link>
              <Link
                href="/"
                className="nav-link-soft rounded-full px-4 py-2 text-sm font-medium text-slate-500 hover:bg-white/70 hover:text-slate-800"
              >
                About
              </Link>
              <Link
                href="/"
                className="nav-link-soft rounded-full px-4 py-2 text-sm font-medium text-slate-500 hover:bg-white/70 hover:text-slate-800"
              >
                Contact
              </Link>
            </div>

            <form
              onSubmit={handleSearch}
              className="hidden w-xs items-center gap-2 rounded-full border border-white/72 bg-white/72 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.86),0_18px_30px_rgba(71,85,105,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_24px_40px_rgba(71,85,105,0.18)] xl:flex"
            >
              <Search size={18} className="text-slate-500" />
              <input
                className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <Link
              href="/cart"
              className="glass-lift glass-sheen overflow-visible relative flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              <ShoppingCart size={18} />
              Cart
              <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full border border-white/80 bg-slate-900 text-[10px] font-semibold text-white shadow-lg">
                {cartCount}
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {!user ? (
                <SignInButton mode="modal">
                  <button className="glass-lift glass-sheen rounded-full px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900">
                    Login
                  </button>
                </SignInButton>
              ) : (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={userButtonAppearance}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="My Orders"
                      labelIcon={
                        <span className="clerk-orders-icon clerk-orders-icon--featured">
                          <PackageIcon size={15} />
                        </span>
                      }
                      onClick={() => router.push("/orders")}
                    />
                    <UserButton.Action
                      label="Add account"
                      labelIcon={
                        <span className="clerk-orders-icon clerk-orders-icon--featured">
                          <PlusCircle size={15} />
                        </span>
                      }
                      onClick={() => router.push("/create-store")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              )}

              {!user ? (
                <SignUpButton mode="modal">
                  <button className="emerald-cta glass-sheen inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white">
                    Sign up
                    <ArrowRight size={14} />
                  </button>
                </SignUpButton>
              ) : (
                <button
                  onClick={() => router.push("/store")}
                  className="emerald-cta glass-sheen inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white"
                >
                  Store
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:hidden">
            <Link
              href="/cart"
              className="glass-lift glass-sheen relative flex items-center rounded-full overflow-visible p-3 text-slate-700"
            >
              <ShoppingCart size={18} />
              <span className="absolute -right-1 -top-1 inline-flex overflow-visible size-5 items-center justify-center rounded-full border border-white/80 bg-slate-900 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            </Link>

            {!user ? (
              <SignInButton mode="modal">
                <button className="glass-lift glass-sheen rounded-full px-4 py-2 text-sm font-medium text-slate-700">
                  Login
                </button>
              </SignInButton>
            ) : (
              <UserButton afterSignOutUrl="/" appearance={userButtonAppearance}>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="My Orders"
                    labelIcon={
                      <span className="clerk-orders-icon clerk-orders-icon--featured">
                        <PackageIcon size={15} />
                      </span>
                    }
                    onClick={() => router.push("/orders")}
                  />
                  <UserButton.Action
                    label="Add account"
                    labelIcon={
                      <span className="clerk-orders-icon">
                        <PlusCircle size={15} />
                      </span>
                    }
                    onClick={() => router.push("/create-store")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

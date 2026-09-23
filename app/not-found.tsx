import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Film, Home, Compass, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link href="/" className="brand-link" aria-label="AstraPlay Home">
          <BrandMark />
        </Link>
        <div className="header-actions">
          <Link href="/" className="icon-button" aria-label="Home">
            <Home />
          </Link>
          <Link href="/discover" className="icon-button" aria-label="Discover">
            <Compass />
          </Link>
          <Link href="/search" className="icon-button" aria-label="Search">
            <Search />
          </Link>
        </div>
      </header>

      <main className="not-found-page">
        <div className="not-found-content">
          <div className="not-found-glitch font-mono" style={{ color: "var(--brand-accent)", letterSpacing: "0.2em" }}>404</div>
          <div className="not-found-icon">
            <Film size={44} />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em", fontSize: "3rem" }}>REEL MISSING FROM VAULT</h1>
          <p>
            The projectionist checked every can in the booth. This print was cut from the reel,
            spliced away, or never struck.
          </p>

          <div className="not-found-actions">
            <Button asChild className="primary-action">
              <Link href="/">
                <Home /> Return to Lobby
              </Link>
            </Button>
            <Button asChild variant="secondary" className="secondary-action">
              <Link href="/discover">
                <Compass /> Explore Archive
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/search">
                <Search /> Search Titles
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Logo() {
    return (
        <a className="brand" href="#" aria-label="PaceUp — home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M7 21.5 13.1 8l2.2 7.1 5.2-4.2L17 24l-2.2-7.1L7 21.5Z" fill="currentColor" />
          <path d="M5 26.5h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
            <span>Pace<span className="brand-accent">Up</span></span>
        </a>
    );
}

function ArrowIcon() {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4.2 10h11.6m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Header() {
    return (
        <header className="site-header">
            <div className="container nav-content">
                <Logo />
                <nav className="main-nav" aria-label="Main navigation">
                    <a href="#possibilities">Features</a><a href="#how-it-works">How it works</a>
                </nav>
                <a className="nav-cta" href="#start">Get started <ArrowIcon /></a>
            </div>
        </header>
    )
}
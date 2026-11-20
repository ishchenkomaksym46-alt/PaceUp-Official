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

function DashboardPreview() {
  return (
    <div className="dashboard-wrap" aria-label="PaceUp dashboard preview">
      <div className="dashboard-glow" />
      <div className="dashboard">
        <div className="dashboard-top">
          <div className="dashboard-brand"><span className="mini-mark">P</span><span>My progress</span></div>
          <span className="period-pill"><span /> This week</span>
        </div>
        <div className="dashboard-greeting">
          <div><p className="eyebrow">MONDAY, MAY 19</p><h2>You&apos;re on a roll, Alex!</h2></div>
          <div className="avatar">A</div>
        </div>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-icon run-icon">↗</span><span className="metric-label">Distance</span>
            <strong>32.4 <small>km</small></strong><span className="metric-change">↑ 12% <span>vs. last week</span></span>
          </div>
          <div className="metric-card">
            <span className="metric-icon time-icon">◷</span><span className="metric-label">Time active</span>
            <strong>4h 28m</strong><span className="metric-change">↑ 8% <span>vs. last week</span></span>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-heading">
            <div><span className="metric-label">Weekly load</span><strong>Your training rhythm</strong></div>
            <span className="chart-legend"><i /> kilometers</span>
          </div>
          <div className="chart-area">
            <div className="chart-y-labels"><span>10</span><span>5</span><span>0</span></div>
            <div className="chart-plot">
              <div className="chart-gridline line-one" /><div className="chart-gridline line-two" /><div className="chart-gridline line-three" />
              <svg className="chart-svg" viewBox="0 0 520 156" preserveAspectRatio="none" role="img" aria-label="Weekly distance chart trending upward toward the weekend">
                <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#37D6AE" stopOpacity=".25" /><stop offset="100%" stopColor="#37D6AE" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 112 C30 101 45 93 76 98 S123 117 151 88 S198 62 226 76 S270 103 301 69 S350 57 377 61 S427 43 452 48 S495 29 520 17 V156 H0Z" fill="url(#chartFill)" />
                <path className="chart-stroke" d="M0 112 C30 101 45 93 76 98 S123 117 151 88 S198 62 226 76 S270 103 301 69 S350 57 377 61 S427 43 452 48 S495 29 520 17" fill="none" stroke="#37D6AE" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                <circle cx="520" cy="17" r="5" fill="#37D6AE" stroke="#151E29" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="chart-x-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
            </div>
          </div>
        </div>
        <div className="dashboard-bottom">
          <div className="next-race-icon">✦</div>
          <div className="next-race-copy"><span>UP NEXT</span><strong>Night Run · 10 km</strong></div>
          <div className="race-date"><strong>24</strong><span>MAY</span></div><ArrowIcon />
        </div>
      </div>
      <div className="floating-badge"><span>✦</span> You&apos;re getting stronger <strong>by 18%</strong></div>
    </div>
  );
}

const features = [
  {
    number: "01",
    title: "All your progress, in one place",
    text: "Distance, pace, heart rate, and training load. Clear charts show how you improve from one workout to the next.",
    icon: "↗",
    className: "feature-chart",
  },
  {
    number: "02",
    title: "Train with intention",
    text: "Plan sessions, log your workouts, and find your rhythm. Your training history is always within reach.",
    icon: "◷",
    className: "feature-calendar",
  },
  {
    number: "03",
    title: "Make every race yours",
    text: "Build your race calendar, get ready for the big day, and save every finish and result.",
    icon: "✦",
    className: "feature-race",
  },
];

const steps = [
  {
    number: "01",
    title: "Log the work",
    text: "Keep workouts, race results, and the details you care about together in one training history.",
  },
  {
    number: "02",
    title: "Spot your patterns",
    text: "Use clear charts to follow distance, time, and consistency across weeks—not just one workout.",
  },
  {
    number: "03",
    title: "Choose what comes next",
    text: "Use your progress and upcoming events to set a meaningful next goal and keep your momentum.",
  },
];

const testimonials = [
  {
    quote: "I want a simple way to connect the miles I put in with the progress I feel on race day.",
    name: "The focused runner",
    detail: "Half-marathon training",
    initials: "FR",
    tone: "mint",
  },
  {
    quote: "A clear training history would help me stay consistent—and celebrate the small wins along the way.",
    name: "The weekend explorer",
    detail: "Running for the joy of it",
    initials: "WE",
    tone: "violet",
  },
  {
    quote: "I want my race calendar and results in the same place as the work that got me to the start line.",
    name: "The race-day regular",
    detail: "Chasing a new personal best",
    initials: "RR",
    tone: "blue",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="pulse-dot" /> YOUR ATHLETIC STORY STARTS HERE</div>
          <h1>Get better.<br /><span>Day by day.</span></h1>
          <p className="hero-description">PaceUp helps you see what matters: how you train, how you grow, and how close you are to your goals.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#start">Start your journey <ArrowIcon /></a>
            <a className="text-link" href="#possibilities">Explore features <span>↓</span></a>
          </div>
          <div className="social-proof">
            <div className="avatar-stack" aria-hidden="true"><span>M</span><span>A</span><span>J</span><span>+</span></div>
            <p><strong>Your journey, your pace.</strong><br />Every workout moves you forward.</p>
          </div>
        </div>
        <DashboardPreview />
      </section>

      <section className="proof-bar" id="how-it-works">
        <div className="container proof-content">
          <p>Don&apos;t just log your workouts.<br /><strong>See where they&apos;re taking you.</strong></p>
          <div className="proof-stat"><strong>01</strong><span>Track every<br />workout</span></div>
          <div className="proof-stat"><strong>02</strong><span>See your<br />real progress</span></div>
          <div className="proof-stat"><strong>03</strong><span>Show up ready<br />on race day</span></div>
        </div>
      </section>

      <section className="journey-section container">
        <div className="section-heading journey-heading">
          <div><span className="section-kicker">A CLEARER VIEW OF YOUR SEASON</span><h2>From today&apos;s workout<br />to <span>your next finish line.</span></h2></div>
          <p>Progress isn&apos;t one big leap. PaceUp brings your training, results, and goals together so you can make sense of every step.</p>
        </div>
        <div className="journey-grid">
          {steps.map((step) => (
            <article className="journey-step scroll-reveal" key={step.number}>
              <span className="journey-number">{step.number}</span>
              <div className="journey-connector" />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="journey-note"><span>✦</span><p><strong>Your progress, in context.</strong> Look beyond a single workout and see the consistency behind every new milestone.</p></div>
      </section>

      <section className="features-section container" id="possibilities">
        <div className="section-heading">
          <div><span className="section-kicker">BUILT FOR YOUR NEXT PR</span><h2>Small steps.<br /><span>Big breakthroughs.</span></h2></div>
          <p>Your training log, performance analytics, and race calendar — everything you need to move forward, without the noise.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className={`feature-card ${feature.className}`} key={feature.number}>
              <div className="feature-card-top"><span className="feature-number">{feature.number}</span><span className="feature-icon">{feature.icon}</span></div>
              <h3>{feature.title}</h3><p>{feature.text}</p>
              <a href="#start" aria-label={`${feature.title} — get started`}><ArrowIcon /></a>
              {feature.className === "feature-chart" && <div className="mini-chart" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>}
              {feature.className === "feature-calendar" && <div className="mini-calendar" aria-hidden="true"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><i /><i /><i className="active" /><i /><i /><i className="active" /><i /><i /><i /><i className="active" /><i /><i /><i /><i className="active" /></div>}
              {feature.className === "feature-race" && <div className="mini-race" aria-hidden="true"><span>UP NEXT</span><strong>10<span>km</span></strong><i>READY FOR THE FINISH</i></div>}
            </article>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-heading testimonial-heading">
            <div><span className="section-kicker">MADE FOR THE MILES THAT MATTER</span><h2>Every athlete has<br /><span>a story in progress.</span></h2></div>
            <p>Whether you&apos;re building a habit or chasing a personal best, your effort deserves a place where it all comes together.</p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card scroll-reveal" key={testimonial.initials}>
                <div className="quote-mark" aria-hidden="true">&ldquo;</div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-person">
                  <span className={`testimonial-avatar ${testimonial.tone}`}>{testimonial.initials}</span>
                  <span><strong>{testimonial.name}</strong><small>{testimonial.detail}</small></span>
                </div>
              </article>
            ))}
          </div>
          <p className="testimonial-disclaimer">Illustrative athlete perspectives, not customer testimonials.</p>
        </div>
      </section>

      <footer className="site-footer container">
        <Logo /><p>Your progress. Your story.</p><span>© 2026 PaceUp</span>
      </footer>
    </main>
  );
}

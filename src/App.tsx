import { useLayoutEffect, useRef } from "react";
import "./App.css";

const PLAYER_CARDS = [1, 2, 3, 4];
const EMBERS = Array.from({ length: 16 }, (_, i) => i);
const HERO_LINES = [
  "> enter room after room",
  "> choose your cards",
  "> spin the roulette",
  "> beat the devil",
];
const TICKER = "SPIN // FIGHT // SURVIVE // ".repeat(6);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const playersRef = useRef<HTMLElement>(null);
  const gameRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;

      if (heroRef.current) {
        heroRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0) rotateZ(${
          y * 0.025
        }deg) rotateY(${y * 0.06}deg)`;
      }

      for (const el of [playersRef.current, gameRef.current]) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const p = clamp((vh - r.top) / (vh * 0.85));
        el.style.setProperty("--p", p.toFixed(3));
        if (p > 0.55) el.classList.add("on");
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--ry", `${x * 12}deg`);
    e.currentTarget.style.setProperty("--rx", `${-y * 9}deg`);
  };
  const onTiltEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "0deg");
  };

  return (
    <>
      <div className="crt" aria-hidden="true" />

      <header className="top">
        <img className="top-logo" src="/assets/logo.png" alt="" />
        <h1 className="top-title">Devil With It</h1>
        <img className="top-logo" src="/assets/logo.png" alt="" />
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="sticker" aria-hidden="true">indie game</span>
            <div className="term">
              <div className="term-bar">
                <span>devil_with_it.exe</span>
                <span className="term-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="term-body">
                <h2 className="glitch" data-text="Enter the rooms of hell">
                  Enter the rooms of hell
                </h2>
                <p>
                  A small indie game with a big hell problem. Every door leads to another
                  room, and every room has something in it that wants you gone.
                </p>
                <ul className="log">
                  {HERO_LINES.map((line, k) => (
                    <li
                      key={line}
                      style={{ "--n": line.length, "--k": k } as React.CSSProperties}
                    >
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="room-bar" aria-hidden="true">
                  <span>room</span>
                  <div className="bar">
                    <i />
                  </div>
                  <span>?</span>
                </div>
                <ul className="chips">
                  <li>indie</li>
                  <li>single player</li>
                  <li>hell themed</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="hero-stage">
            <div className="hero-scroll" ref={heroRef}>
              <div className="hero-wind">
                <div className="hero-float">
                  <img
                    className="hero-card"
                    src="/assets/hero-card.png"
                    alt="Devil With It főkártya"
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="hero-hint">scroll down</p>
        </section>

        <section className="players" ref={playersRef}>
          <div className="embers" aria-hidden="true">
            {EMBERS.map((i) => (
              <span
                key={i}
                style={
                  {
                    "--x": `${(i * 37) % 100}%`,
                    "--dx": `${((i % 5) - 2) * 24}px`,
                    "--d": `${7 + (i % 5) * 2}s`,
                    "--s": `${-i * 1.7}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="fan" role="img" aria-label="Négy választható kártya egymásra rakva">
            <div className="rays" aria-hidden="true">
              <div className="rays-spin" />
            </div>
            {PLAYER_CARDS.map((n, i) => (
              <div
                key={n}
                className="fan-card"
                style={{ "--i": i, zIndex: i + 1 } as React.CSSProperties}
              >
                <img src={`/assets/player-${n}.png`} alt="" />
              </div>
            ))}
          </div>

          <div className="text-block dialog">
            <p className="kicker">&gt; select your fighter</p>
            <h2 className="glitch" data-text="Player cards">
              Player cards
            </h2>
            <p>
              This is a single-player game, and your cards are your weapons. Choose the
              ones you want to carry and fight your way through whatever crawls out of the
              pit.
            </p>
            <ul className="chips">
              <li>single player</li>
              <li>choose your cards</li>
              <li>no mercy</li>
            </ul>
          </div>
        </section>

        <section className="gameplay" ref={gameRef}>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              <span>{TICKER}</span>
              <span>{TICKER}</span>
            </div>
          </div>

          <div className="stage">
            <div className="wheel" aria-hidden="true">
              <div className="wheel-spin" />
              <div className="ball" />
              <div className="hub">666</div>
            </div>

            <div className="monitor-wrap" onMouseMove={onTilt} onMouseLeave={onTiltEnd}>
              <div className="monitor">
                <div className="screen">
                  <img src="/assets/gameplay.png" alt="Gameplay screenshot" />
                  <div className="glare" />
                </div>
                <div className="monitor-bar">
                  <span className="brand">DEVIL-TV</span>
                  <span className="knobs">
                    <i />
                    <i />
                    <b className="led" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-block dialog">
            <p className="kicker">&gt; hell.exe</p>
            <h2 className="glitch" data-text="Hell is open">
              Hell is open
            </h2>
            <p>
              The whole game takes place in hell, and the devils are not happy to see you.
              Fight them one by one, and let the crazy roulette wheel decide how the battle
              goes. Spin, hope, survive.
            </p>
            <ul className="chips">
              <li>devils: hostile</li>
              <li>roulette: on</li>
              <li>exit: none</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="foot">
        <p>
          Soon available<span className="cursor">_</span>
        </p>
      </footer>
    </>
  );
}
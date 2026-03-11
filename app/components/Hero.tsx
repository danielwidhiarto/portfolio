export default function Hero() {
  const scrollToPublications = () => {
    document
      .getElementById("publications")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" id="hero">
      {/* Top row: eyebrow */}
      <div className="hero-top">
        <div className="hero-eyebrow">Lecturer · Researcher · Developer</div>
      </div>

      {/* Name block — degrees sandwiching the name */}
      <div className="hero-name-block">
        {/* <div className="hero-degree-above">Prof. Dr.</div> */}
        <h1 className="hero-title">
          <span className="line">
            <span>Emmanuel Daniel</span>
          </span>
          <span className="line">
            <span>Widhiarto</span>
          </span>
        </h1>
        <div className="hero-degree-below">S.Kom.</div>
      </div>

      <div className="hero-divider" />

      {/* Bottom: role left · description right */}
      <div className="hero-bottom">
        <p className="hero-role">
          <strong>Specialist Lecturer S1</strong>
          <br />
          Faculty of Computer Science
          <br />
          <span style={{ fontSize: ".8em", opacity: 0.7 }}>
            Universitas XYZ
          </span>
        </p>
        <p className="hero-sub">
          I research, teach, and build. My work lives at the intersection of
          academic rigor and real-world engineering — ideas that publish{" "}
          <em>and</em> ship.
        </p>
      </div>

      <div className="hero-cta">
        <button className="btn-primary" onClick={scrollToPublications}>
          View Publications
        </button>
        <a className="btn-ghost" href="#projects">
          Dev Projects
        </a>
        <a className="btn-ghost" href="#contact">
          Contact
        </a>
      </div>

      <div className="hero-stats">
        <div>
          <div className="stat-num">8+</div>
          <div className="stat-label">Papers Published</div>
        </div>
        <div>
          <div className="stat-num">3yr</div>
          <div className="stat-label">Research</div>
        </div>
        <div>
          <div className="stat-num">20+</div>
          <div className="stat-label">Projects Shipped</div>
        </div>
        <div>
          <div className="stat-num">∞</div>
          <div className="stat-label">Curiosity</div>
        </div>
      </div>
    </section>
  );
}

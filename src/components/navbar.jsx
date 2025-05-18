const Navbar = () => {
  return (
    <header className="frame">
      <h1 className="frame__title">Repeating Image Transition</h1>
      <nav className="frame__links">
        <a className="line" href="https://tympanus.net/codrops/?p=92571">
          More info,
        </a>

        <a
          className="line"
          href="https://github.com/codrops/RepeatingImageTransition/"
        >
          Code,
        </a>

        <a className="line" href="https://tympanus.net/codrops/demos/">
          All demos
        </a>
      </nav>
      <nav className="frame__tags">
        <a
          className="line"
          href="https://tympanus.net/codrops/demos/?tag=page-transition"
        >
          page-transition,
        </a>

        <a
          className="line"
          href="https://tympanus.net/codrops/demos/?tag=repetition"
        >
          repetition,
        </a>

        <a className="line" href="https://tympanus.net/codrops/demos/?tag=grid">
          grid
        </a>
      </nav>
    </header>
  );
};

export default Navbar;

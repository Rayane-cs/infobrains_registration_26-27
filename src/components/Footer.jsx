export default function Footer() {
  return (
    <footer className="site-footer no-print">
      <div className="section-inner footer-grid">
        <a className="footer-brand" href="#home" aria-label="InfoBrains Open Day home">
          InfoBrains
        </a>
        <p>A university club for technology, science, and creative collaboration.</p>
        <nav aria-label="Footer">
          <a href="#home">Home</a>
          <a href="#attendance">Attendance</a>
          <a href="#about">About</a>
        </nav>
      </div>
    </footer>
  );
}

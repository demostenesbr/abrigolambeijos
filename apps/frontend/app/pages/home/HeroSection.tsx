export default function HeroSection() {
  return (
    <section className="hero-section">
        <div className="hero-content">
            <h1>Welcome to Abrigo Lambeijos</h1>
            <p>We are dedicated to rescuing and caring for abandoned animals. Join us in our mission to provide love and shelter to those in need.</p>
            <a href="/adoption" className="btn btn-primary">Adopt a Pet</a>
        </div>
        <div className="hero-image">
            <img src="/images/hero-image.jpg" alt="Happy pets" />
        </div>
    </section>
  );
}
import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-slate-800">
      {/* Hero Section */}
      <div className="bg-[url('/fashion-bg.jpg')] bg-cover bg-center py-24 px-6 text-white text-center relative">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Who We Are</h1>
          <p className="text-lg sm:text-xl font-light">
            Revolutionizing fashion with sustainable rental wear.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            At <span className="font-semibold">Rentalog.in</span>, we believe fashion shouldn't cost the earth—or your wallet.
            Our platform empowers you to rent high-quality, stylish clothing for every occasion—weddings, festivals, parties,
            or casual outings—without the guilt of fast fashion or the commitment of ownership.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Eco-conscious fashion solutions</li>
            <li>Affordable designer looks</li>
            <li>Doorstep delivery and easy returns</li>
            <li>Curated collections for all styles and sizes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Built With Passion</h2>
          <p className="text-gray-700 leading-relaxed">
            We are a team of tech enthusiasts and fashion lovers who came together to redefine how people experience style.
            Our goal is to offer you convenience, affordability, and confidence with every outfit you rent.
          </p>
        </section>

        {/* Call to Action */}
        <div className="bg-blue-100 border-l-4 border-blue-400 p-6 rounded shadow text-blue-800 text-center">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">Ready to refresh your wardrobe?</h3>
          <p className="mb-4">Explore our latest collections now and rent your dream outfit today.</p>
          <a
            href="/search"
            className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
          >
            Browse Collections →
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;

import React from 'react';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Home = () => {
  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-10 py-20 max-w-7xl mx-auto flex-grow">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="text-green-400">Practice Trading</span> <br /> Without Risk
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            TradeSathi is your ultimate paper trading platform to simulate real-time stock market experience using virtual money. Learn, practice, and strategize before going live!
          </p>
          <a
            href="/trade"
            className="bg-green-400 text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-green-300 transition duration-300"
          >
            Start Paper Trading
          </a>
        </div>

        {/* Animation */}
        <div className="md:w-1/2 flex justify-start md:pl-12 scale-[1.3] md:scale-[1.4] mb-10 md:mb-0">
          <DotLottieReact
            src="https://lottie.host/574817b5-5607-4779-b801-d8dccbb41d77/R6c9Dwf4at.lottie"
            loop
            autoplay
            style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-green-400">Why Choose TradeSathi?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Real-Time Market Data',
                desc: 'Practice trading with real market data to simulate authentic strategies and timing.',
                icon: '📈',
              },
              {
                title: 'No Financial Risk',
                desc: 'Trade with virtual currency—perfect for beginners and experienced traders alike.',
                icon: '💰',
              },
              {
                title: 'Track Performance',
                desc: 'Monitor your portfolio and trade performance with intuitive dashboards.',
                icon: '📊',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="text-center py-16 bg-gradient-to-br from-green-400 to-green-600 text-black">
        <h2 className="text-4xl font-bold mb-4">Ready to Master the Markets?</h2>
        <p className="text-lg mb-6">Sign up now and start trading with ₹1,00,000 virtual money!</p>
        <a
          href="/login"
          className="bg-black text-green-400 px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition"
        >
          Get Started
        </a>
      </section>
    </div>
  );
};

export default Home;

export const metadata = {
  title: "About",
};

export default function About() {
  return (
    <>
       {/* TOP SECTION */}
     <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-green-50 to-white">
  {/* LEFT SIDE */}
  <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 py-10">
    <div className="max-w-xl space-y-6">
      <h1 className="text-5xl font-bold text-green-900 leading-tight">
        About Our Dairy Farm 🏡
      </h1>

      <p className="text-lg text-gray-700 leading-8">
        🥛 We are dedicated to delivering{" "}
        <span className="font-semibold text-green-700">
          fresh, pure, and high-quality dairy products
        </span>{" "}
        directly from our farm to your home.
      </p>

      <p className="text-lg text-gray-700 leading-8">
        🧈 From <span className="font-semibold">milk</span>,{" "}
        <span className="font-semibold">curd</span>, and{" "}
        <span className="font-semibold">butter</span> to other dairy essentials,
        every product is prepared with care, hygiene, and love.
      </p>

      <p className="text-lg text-gray-700 leading-8">
        🌱 We believe in keeping things natural — no harmful chemicals, no
        unnecessary preservatives, only fresh goodness.
      </p>

      <p className="text-lg text-gray-700 leading-8">
        🎯 Our mission is to make healthy dairy products easily available for
        every family.
      </p>
    </div>
  </div>

  {/* RIGHT SIDE IMAGE */}
  <div className="w-full md:w-1/2 flex items-center justify-center p-6">
    <img
      src="/hero1.png"
      alt="farm"
      className="w-full h-[85vh] object-cover rounded-3xl shadow-2xl"
    />
  </div>
</div>

      {/* FEATURES SECTION BELOW AFTER SCROLL */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose Us ✨
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">🥛</div>
              <h3 className="text-2xl font-semibold mb-2">Fresh Daily</h3>
              <p className="text-gray-600">
                Farm-fresh products delivered straight from our dairy farm to
                your doorstep.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-semibold mb-2">
                Natural & Organic
              </h3>
              <p className="text-gray-600">
                No artificial preservatives or chemicals.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-2xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Reliable delivery service for maximum freshness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import heroBloodImg from "../../assets/blood-donation-hero.png";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-red-50 to-white min-h-[85vh] flex items-center">
      <div className="max-w-7xl mx-auto px-8 w-full">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}
          <div>

            <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold">
              ❤️ Save Lives Through Blood Donation
            </span>

            <h1 className="mt-6 text-6xl font-extrabold leading-tight text-gray-900">
              Donate Blood,
              <br />
              <span className="text-red-600">
                Save Every Life
              </span>
            </h1>

            <p className="mt-8 text-xl text-gray-600 leading-9">
              LifeLink connects blood donors with patients instantly.
              One donation can save up to three lives. Join our mission
              and become someone's hero today.
            </p>

            <div className="mt-10 flex gap-5">

              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition">
                Become a Donor
              </button>

              <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition">
                Request Blood
              </button>

            </div>

            {/* Stats */}
            <div className="flex gap-12 mt-14">

              <div>
                <h2 className="text-3xl font-bold text-red-600">
                  10K+
                </h2>
                <p className="text-gray-500">
                  Registered Donors
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-red-600">
                  5K+
                </h2>
                <p className="text-gray-500">
                  Lives Saved
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-red-600">
                  120+
                </h2>
                <p className="text-gray-500">
                  Hospitals
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-3xl border-2 border-red-200 shadow-2xl">
              <img
                src={heroBloodImg}
                alt="Donate Blood - Hands holding a blood drop"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;
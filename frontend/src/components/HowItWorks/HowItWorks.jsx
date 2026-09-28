import {
  FaUserPlus,
  FaSearch,
  FaTint,
  FaHeart,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus />,
    title: "Register",
    description: "Create your donor account in just a few minutes.",
  },
  {
    icon: <FaSearch />,
    title: "Find Donor",
    description: "Search nearby verified blood donors instantly.",
  },
  {
    icon: <FaTint />,
    title: "Donate Blood",
    description: "Donate blood safely and help someone in need.",
  },
  {
    icon: <FaHeart />,
    title: "Save Lives",
    description: "Every donation can save up to three lives.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-red-50 py-24">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">
          <p className="text-red-600 font-semibold uppercase tracking-widest">
            Simple Process
          </p>

          <h2 className="text-5xl font-bold mt-4">
            How LifeLink Works
          </h2>

          <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
            Register, search for verified donors, donate blood, and
            become a hero by saving lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center text-4xl text-red-600">
                {step.icon}
              </div>

              <h3 className="text-2xl font-bold mt-6">
                {step.title}
              </h3>

              <p className="text-gray-600 mt-4 leading-7">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
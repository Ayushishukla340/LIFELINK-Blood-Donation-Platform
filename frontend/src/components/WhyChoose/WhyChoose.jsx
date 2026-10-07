import { FaUserShield, FaMapMarkerAlt, FaClock, FaHeartbeat } from "react-icons/fa";

const features = [
  {
    icon: <FaUserShield />,
    title: "Verified Donors",
    description: "Every donor profile is verified for authenticity and safety.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Nearby Search",
    description: "Find blood donors near your location quickly and easily.",
  },
  {
    icon: <FaClock />,
    title: "24×7 Availability",
    description: "Emergency blood requests can be created anytime.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Save Lives",
    description: "One donation can help save up to three lives.",
  },
];

function WhyChoose() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">
          <p className="text-red-600 dark:text-red-400 font-semibold uppercase tracking-widest">
            Why Choose Us
          </p>

          <h2 className="text-5xl font-bold mt-4 text-slate-900 dark:text-slate-100">
            Why Choose LifeLink
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mt-5 max-w-3xl mx-auto">
            We make blood donation simple, secure and fast by connecting verified donors with patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item, index) => (
            <div
              key={index}
              className="bg-red-50/70 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-3xl p-8 text-center hover:-translate-y-3 hover:shadow-xl dark:hover:shadow-slate-950/60 transition-all duration-300"
            >
              <div className="text-5xl text-red-600 dark:text-red-400 flex justify-center">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold mt-6 text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-400 mt-4 leading-7">
                {item.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default WhyChoose;
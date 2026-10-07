import bloodFacts from "../../data/bloodFacts";
import Card from "../Card/Card";

function BloodFacts() {
  return (
    <section className="bg-white dark:bg-slate-900/50 py-24 transition-colors">
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}
        <div className="text-center mb-16">

          <p className="text-red-600 dark:text-red-400 font-semibold uppercase tracking-widest">
            Learn & Donate
          </p>

          <h2 className="text-5xl font-bold mt-4 text-slate-900 dark:text-slate-100">
            Blood Donation Facts
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-lg mt-5 max-w-3xl mx-auto leading-8">
            Blood donation is one of the simplest ways to save lives.
            Every donation can help patients during surgeries,
            accidents, cancer treatment, and medical emergencies.
          </p>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {bloodFacts.map((fact) => (
            <Card
              key={fact.id}
              icon={fact.icon}
              title={fact.title}
              description={fact.description}
            />
          ))}

        </div>

      </div>
    </section>
  );
}

export default BloodFacts;
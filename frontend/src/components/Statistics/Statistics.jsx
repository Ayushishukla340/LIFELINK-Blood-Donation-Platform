function Statistics() {
  const stats = [
    { number: 5000, suffix: "+", label: "Registered Donors" },
    { number: 1200, suffix: "+", label: "Blood Requests" },
    { number: 150, suffix: "+", label: "Partner Hospitals" },
    { number: 10000, suffix: "+", label: "Lives Saved" },
  ];

  return (
    <section className="bg-red-600 py-20 text-white">
      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center mb-14">
          Our Impact
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {stats.map((item, index) => (
            <div
              key={index}
              className="text-center"
            >

              <h3 className="text-5xl font-bold">
                {item.number}{item.suffix}
              </h3>

              <p className="mt-4 text-lg">
                {item.label}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Statistics;
function Card({ icon, title, description }) {
  return (
    <div className="group bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 text-center">

      {/* Icon */}
      <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center text-5xl group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-6 text-2xl font-bold text-gray-900">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-4 text-gray-600 leading-7">
        {description}
      </p>

    </div>
  );
}

export default Card;
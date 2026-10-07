function Card({ icon, title, description }) {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-md border border-slate-100 dark:border-slate-800 hover:shadow-2xl dark:hover:shadow-slate-950/60 hover:-translate-y-3 transition-all duration-300 text-center">

      {/* Icon */}
      <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-5xl text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white dark:group-hover:bg-red-600 dark:group-hover:text-white transition-all duration-300">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-4 text-slate-600 dark:text-slate-400 leading-7">
        {description}
      </p>

    </div>
  );
}

export default Card;
function DonateBlood() {
  return (
    <div className="min-h-screen bg-gray-100 py-16">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-4xl font-bold text-red-600 text-center mb-3">
          Donate Blood
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Become a blood donor and help save someone's life.
        </p>


        <form className="space-y-5">

          <div>
            <label className="block mb-2 font-semibold">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>


          <div>
            <label className="block mb-2 font-semibold">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>


          <div>
            <label className="block mb-2 font-semibold">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>


          <div>
            <label className="block mb-2 font-semibold">
              Blood Group
            </label>

            <select className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500">

              <option>
                Select Blood Group
              </option>

              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>

            </select>
          </div>


          <div>
            <label className="block mb-2 font-semibold">
              City / Location
            </label>

            <input
              type="text"
              placeholder="Enter your city"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>


          <div>
            <label className="block mb-2 font-semibold">
              Last Blood Donation Date
            </label>

            <input
              type="date"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>


          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
          >
            Register as Donor
          </button>


        </form>

      </div>

    </div>
  );
}

export default DonateBlood;
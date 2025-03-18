import { motion } from "framer-motion";

import LoginIcon from "../assets/login.jsx";

const FormLayout = ({ children }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 p-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col md:flex-row bg-white/30 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-lg md:max-w-5xl border border-white/50 relative overflow-hidden"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 pointer-events-none"></div>

      <div className="hidden md:flex flex-col items-center justify-center pr-8 border-r border-white/40 relative z-10">
        <LoginIcon width={150} height={75} />
        <h2 className="text-3xl font-bold text-gray-700 drop-shadow-sm">
          Welcome!
        </h2>
        <p className="text-gray-600 mt-3 text-center px-4 leading-relaxed">
          Start managing your account effortlessly.
        </p>
      </div>

      <div className="w-full mt-4 md:mt-0 md:pl-8 relative z-10">
        {children}
      </div>
    </motion.div>
  </div>
);

export default FormLayout;

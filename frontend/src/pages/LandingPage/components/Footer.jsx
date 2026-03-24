import { Briefcase } from "lucide-react";
const Footer = () => {
  return (
    <footer className="relative  bg-gray-50 text-gray-900 overflow-hidden">
      <div className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Main footer Content */}
          <div className="text-center space-y-8">
            {/* Logo / Brand */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="size-10 bg-linear-to-r  from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="size-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">JobPortal</h3>
              </div>

              <p className={"text-sm text-gray-600 max-w-md wxaut"}>
                Connecting talented professionals with innovative companies
                worldwide. Your career success is our mission.
              </p>
            </div>

            {/* Copyright */}
            <div className="space-y-2">
              <p className={"text-sm text-gray-600"}>
                &copy; {new Date().getFullYear()} Karan Dangol.
              </p>
              <p className={"text-xs text-gray-500"}>
                Made with 💖. Happy coding!
              </p>
            </div>
      
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

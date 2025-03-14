import { Link } from "react-router-dom";

/**
 * Component to display when a user tries to access a page they don't have permission for
 * @param {Object} props - Component props
 * @param {String} props.message - Custom message to display
 * @param {String} props.redirectPath - Path to redirect to
 * @param {String} props.redirectText - Text for the redirect link
 * @returns {React.ReactNode} - Rendered component
 */
const UnauthorizedAccess = ({
  message = "You don't have permission to access this page.",
  redirectPath = "/employee/dashboard",
  redirectText = "Go to Dashboard",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-8">{message}</p>
        <Link
          to={redirectPath}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {redirectText}
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;

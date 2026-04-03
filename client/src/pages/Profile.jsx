import { useState } from "react";
import { CiMail, CiUser, CiLock, CiCamera } from "react-icons/ci";
import { useSelector } from "react-redux";
import { useChangePassword } from "../hooks/useUser";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Profile() {
  useDocumentTitle("Profile");
  const { user } = useSelector((state) => state.auth);
  const [isError, setIsError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { mutate, isPending } = useChangePassword({
    onSuccess: () => {
      setSuccessMessage("Password Changed Successfully");
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      setIsError(error?.response?.data?.error);
      setTimeout(() => {
        setIsError("");
      }, 10000);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setIsError("Please enter all fields");
      setTimeout(() => {
        setIsError("");
      }, 10000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setIsError("New password and confirm password do not match.");
      setTimeout(() => {
        setIsError("");
      }, 10000);
      return;
    }
    mutate(formData);
  };

  return (
    <div className="min-h-screen bg-transparent relative z-10">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/4 -translate-x-1/3" />

      {/* Main content */}
      <div className="max-w-4xl mx-auto p-4 md:p-8 relative">
        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
              Profile Settings
            </h1>
            <p className="text-lg text-slate-400 mt-2">
              Update your personal information and password
            </p>
          </div>

          {successMessage && (
            <div className="mb-8 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-sm shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-emerald-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-emerald-300">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel overflow-hidden border border-white/10 rounded-3xl">
            <div className="px-6 py-8 sm:px-10 border-b border-white/10">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="relative mb-6 sm:mb-0 group cursor-pointer">
                  <img
                    src={user.user.avatar}
                    alt="User avatar"
                    className="h-24 w-24 rounded-full bg-slate-800 border border-white/10 mx-auto sm:mx-0 object-cover shadow-inner group-hover:opacity-80 transition-opacity"
                  />
                  <button className="absolute bottom-0 right-0 sm:right-0 bg-indigo-500 rounded-full p-2 border border-indigo-400/30 shadow-lg text-white hover:bg-indigo-600 transition-colors">
                    <CiCamera className="h-4 w-4" />
                  </button>
                </div>
                <div className="ml-0 sm:ml-6 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-sm">
                    {user.user.name}
                  </h2>
                  <p className="text-base text-slate-400 bg-white/5 inline-block px-3 py-1 rounded-full border border-white/5 mt-1">
                    {user.user.email}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="divide-y divide-white/10">
              {/* Personal Information */}
              <div className="px-6 py-8 sm:p-10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CiUser className="h-6 w-6 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={user.user.name}
                        className="glass-input block w-full !pl-12 !py-3.5 opacity-60 cursor-not-allowed font-medium text-white"
                        placeholder="Your full name"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CiMail className="h-6 w-6 text-slate-500" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={user.user.email}
                        disabled
                        className="glass-input block w-full !pl-12 !py-3.5 opacity-60 cursor-not-allowed font-medium text-white"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="px-6 py-8 sm:p-10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-rose-500 rounded-full inline-block"></span>
                  Change Password
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CiLock className="h-6 w-6 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="glass-input block w-full !pl-12 !py-3.5 font-medium text-white"
                        placeholder="Enter your current password"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CiLock className="h-6 w-6 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="glass-input block w-full !pl-12 !py-3.5 font-medium text-white"
                        placeholder="Enter new password"
                        minLength={8}
                      />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CiLock className="h-6 w-6 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="glass-input block w-full !pl-12 !py-3.5 font-medium text-white"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {isError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-5 py-3.5 rounded-xl font-semibold backdrop-blur-sm">
                      {isError}
                    </div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-5 py-3.5 rounded-xl font-semibold backdrop-blur-sm">
                      {successMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="px-6 py-6 sm:p-10">
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    disabled
                    className="glass-btn-outline !py-3 !px-6 opacity-50 cursor-not-allowed text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className={`glass-btn !py-3 !px-6 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

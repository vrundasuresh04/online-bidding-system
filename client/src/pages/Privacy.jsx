import { use, useState } from "react";
import { Link } from "react-router";
import {
  CiCalendar,
  CiGlobe,
  CiMapPin,
  CiServer,
  CiMonitor,
} from "react-icons/ci";
import LoadingScreen from "../components/LoadingScreen";
import { useLoginHistory } from "../hooks/useUser";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Privacy() {
  useDocumentTitle("Security & Login History");
  const { data, isLoading } = useLoginHistory();

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen relative bg-transparent z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">
            Privacy & Security
          </h1>
          <p className="text-lg text-slate-400 mt-2">
            View your login history and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Security Area - left cols */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block"></span>
              Recent Login History
            </h2>
            
            {data && data.length > 0 ? (
              <div className="flex flex-col gap-5">
                {data.map((entry) => (
                  <div
                    key={entry.id}
                    className="glass-panel rounded-2xl border border-white/10 p-6 hover:border-indigo-500/30 transition-colors group"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      <div className="flex items-start gap-3">
                        <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
                          <CiCalendar className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                          <p className="text-sm font-semibold text-white mt-0.5">{entry.dateTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
                          <CiGlobe className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IP Address</p>
                          <p className="text-sm font-semibold text-white mt-0.5">{entry.ipAddress}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/30">
                          <CiMapPin className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                          <p className="text-sm font-semibold text-white mt-0.5">{entry.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-rose-500/20 p-2 rounded-lg border border-rose-500/30">
                          <CiServer className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ISP</p>
                          <p className="text-sm font-semibold text-white mt-0.5">{entry.isp}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <div className="bg-sky-500/20 p-2 rounded-lg border border-sky-500/30">
                          <CiMonitor className="w-5 h-5 text-sky-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Device</p>
                          <p className="text-sm font-semibold text-white mt-0.5 break-all">{entry.device}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="glass-panel p-10 text-center rounded-2xl border border-white/10">
                 <p className="text-slate-400 font-medium">No login history recorded yet.</p>
               </div>
            )}
          </div>

          {/* Security settings - right col */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-purple-500 rounded-full inline-block"></span>
              Settings
            </h2>
            
            <div className="glass-panel overflow-hidden border border-white/10 rounded-3xl divide-y divide-white/10 shadow-xl">
              
              <div className="px-6 py-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Add an extra layer of security to your account by requiring
                      a verification code in addition to your password.
                    </p>
                  </div>
                  <div>
                    <button
                      disabled
                      className="glass-btn w-full !opacity-50 !cursor-not-allowed !py-2.5"
                    >
                      Enable 2FA (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 bg-white/5">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">
                      Password
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Change your account login password and ensure it remains secure.
                    </p>
                  </div>
                  <div>
                    <Link
                      to="/profile"
                      className="glass-btn-outline w-full flex justify-center !py-2.5 text-sm"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
            
        </div>
      </div>
    </div>
  );
}

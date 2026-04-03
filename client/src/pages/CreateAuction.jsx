import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useCreateAuction } from "../hooks/useAuction.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

export const CreateAuction = () => {
  useDocumentTitle("Create Auction");
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    itemCategory: "",
    startingPrice: "",
    itemStartDate: "",
    itemEndDate: "",
    itemPhoto: "",
  });

  const { mutate, isPending } = useCreateAuction({
    onSuccess: (data) => {
      setFormData({
        itemName: "",
        itemDescription: "",
        itemCategory: "",
        startingPrice: "",
        itemStartDate: "",
        itemEndDate: "",
        itemPhoto: "",
      });
      setError("");
      navigate(`/auction/${data.newAuction._id}`);
    },
    onError: (error) =>
      setError(error?.response?.data?.message || "Something went wrong"),
  });

  const categories = [
    "Electronics",
    "Antiques",
    "Art",
    "Books",
    "Clothing",
    "Collectibles",
    "Home & Garden",
    "Jewelry",
    "Musical Instruments",
    "Sports",
    "Toys",
    "Vehicles",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);

      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
      }

      if (fileSizeMB > 5) {
        setError(`File size must be less than 5 MB.`);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        itemPhoto: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemPhoto) {
      setError("Please upload an image.");
      return;
    }

    const start = new Date(formData.itemStartDate);
    const end = new Date(formData.itemEndDate);

    if (end <= start) {
      setError("End date must be after start date.");
      return;
    }

    mutate(formData);
  };

  //   today date
  const today = new Date().toISOString().split("T")[0];

  //   today+15 days
  const maxStart = new Date();
  maxStart.setDate(maxStart.getDate() + 15);
  const maxStartDate = maxStart.toISOString().split("T")[0];

  //   max end date
  let maxEndDate = "";
  if (formData.itemStartDate) {
    const end = new Date(formData.itemStartDate);
    end.setDate(end.getDate() + 15);
    maxEndDate = end.toISOString().split("T")[0];
  }

  const inputClasses = "glass-input w-full !py-3.5";

  return (
    <div className="min-h-screen bg-transparent relative z-10">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/4 translate-x-1/3" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-400 transition mb-6 group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md">Create Auction</h1>
          <p className="text-lg text-slate-400 mt-2">List an item for bidding</p>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Item Name */}
              <div>
                <label
                  htmlFor="itemName"
                  className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                >
                  Item Name
                </label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="e.g. Vintage mechanical watch"
                  required
                />
              </div>

              {/* Item Description */}
              <div>
                <label
                  htmlFor="itemDescription"
                  className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                >
                  Description
                </label>
                <textarea
                  id="itemDescription"
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className={`${inputClasses} resize-y min-h-[120px]`}
                  placeholder="Describe condition, features, and any relevant details"
                  required
                />
              </div>

              {/* Category and Starting Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="itemCategory"
                    className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                  >
                    Category
                  </label>
                  <select
                    id="itemCategory"
                    name="itemCategory"
                    value={formData.itemCategory}
                    onChange={handleInputChange}
                    className={`${inputClasses} [&>option]:bg-slate-900 [&>option]:text-white`}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="startingPrice"
                    className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                  >
                    Starting Price (Rs)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      id="startingPrice"
                      name="startingPrice"
                      value={formData.startingPrice}
                      onChange={handleInputChange}
                      min="1"
                      step="1"
                      className={`${inputClasses} !pl-12 tabular-nums font-bold`}
                      placeholder="100"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="itemStartDate"
                    className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                  >
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="itemStartDate"
                      name="itemStartDate"
                      min={today}
                      value={formData.itemStartDate}
                      max={maxStartDate}
                      onChange={handleInputChange}
                      className={`${inputClasses} [&::-webkit-calendar-picker-indicator]:invert-[0.8]`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="itemEndDate"
                    className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest"
                  >
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="itemEndDate"
                      name="itemEndDate"
                      value={formData.itemEndDate}
                      onChange={handleInputChange}
                      min={formData.itemStartDate}
                      max={maxEndDate}
                      className={`${inputClasses} [&::-webkit-calendar-picker-indicator]:invert-[0.8]`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest">
                  Photo
                </label>
                {!formData.itemPhoto ? (
                  <label
                    htmlFor="itemPhoto"
                    className="flex flex-col items-center justify-center w-full h-48 border-[1.5px] border-dashed border-white/20 rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-indigo-500/20 rounded-full flex items-center justify-center mb-3 border border-indigo-500/30">
                      <svg
                        className="w-6 h-6 text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-base font-semibold text-slate-300">
                      Click to upload image
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-1">PNG, JPG up to 5 MB</p>
                    <input
                      type="file"
                      id="itemPhoto"
                      name="itemPhoto"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative inline-block group">
                    <img
                      src={URL.createObjectURL(formData.itemPhoto)}
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded-2xl border border-white/10 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, itemPhoto: "" }));
                        fileInputRef.current.value = "";
                      }}
                      className="absolute -top-3 -right-3 bg-slate-800 border-2 border-slate-900 rounded-full p-2 shadow-xl hover:bg-rose-500 hover:text-white text-slate-400 transition-colors z-10"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="absolute inset-0 border-2 border-indigo-500/50 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-5 py-3.5 rounded-xl text-sm font-semibold backdrop-blur-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="pt-6 border-t border-white/5">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`glass-btn w-full sm:w-auto !py-3.5 !px-10 text-base ${
                    isPending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isPending ? "Creating..." : "Create Auction"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tips */}
        <HelpSection />
      </div>
    </div>
  );
};

export const HelpSection = () => {
  const tips = [
    "Use clear, high-quality photos showing your item from multiple angles",
    "Write detailed descriptions including condition, dimensions, and flaws",
    "Set a reasonable starting price to attract bidders",
    "3-7 day auction duration typically works best",
    "Select the most accurate category to help buyers find your item",
  ];

  return (
    <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/30">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-amber-300 uppercase tracking-widest">
          Tips for a successful listing
        </h3>
      </div>
      
      <ul className="space-y-3 relative z-10">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-medium text-amber-100/80">
            <span className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] mt-0.5">&#10148;</span>
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

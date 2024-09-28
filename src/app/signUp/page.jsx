// pages/signUp/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/signIn"); // Redirect to the sign-in page after successful signup
    } else {
      const errorData = await res.json();
      console.error("Failed to sign up:", errorData);
    }
  };
  const togglePasswordHandler = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20 mb-12 mt-20 flex flex-col items-center justify-center text-center">
      <div className="mb-4 flex max-w-fit items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white px-8 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
        <p className="text-sm font-semibold text-black">Welcome to TaskD.</p>
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-sm h-auto overflow-hidden bg-transparent backdrop-blur-md p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="">
          <div className="flex flex-col relative w-full border-b-2 border-black mb-8">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-3 py-2 mt-1 sm:text-sm focus:ring-0 bg-transparent border-none outline-none box-shadow-none"
              required
            />
            <label
              htmlFor="email"
              className="absolute text-md font-medium ml-2 text-gray-700 transition-all transform -translate-y-1/2 top-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-5 peer-focus:text-sm peer-valid:top-0 peer-valid:-translate-y-5 peer-valid:text-sm"
            >
              Email
            </label>
          </div>
          <div className="flex flex-col relative w-full border-b-2 border-black mb-8">
            <div className="flex flex-col">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full px-3 py-2 mt-1 sm:text-sm focus:ring-0 bg-transparent border-none outline-none box-shadow-none"
                required
              />
              <label
                htmlFor="password"
                className="absolute text-md font-medium ml-2 text-gray-700 transition-all transform -translate-y-1/2 top-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-5 peer-focus:text-sm peer-valid:top-0 peer-valid:-translate-y-5 peer-valid:text-sm"
              >
                Password
              </label>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pb-1">
              {showPassword ? (
                <Eye
                  className="text-gray-500 cursor-pointer"
                  onClick={togglePasswordHandler}
                />
              ) : (
                <EyeOff
                  className="text-gray-500 cursor-pointer"
                  onClick={togglePasswordHandler}
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className={buttonVariants({
              size: "default",
              className: "w-full py-2 rounded-xl text-white bg-blue-500",
            })}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

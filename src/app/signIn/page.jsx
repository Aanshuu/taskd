// pages/signIn/page.jsx
"use client";

import { useState, useEffect } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      csrfToken, // Pass the CSRF token
    });
    if (res?.ok) {
      router.push("/task"); // Redirect to the task page after successful login
    } else {
      console.error("Failed to sign in");
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
            <input type="hidden" name="csrfToken" value={csrfToken} />
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
            Login In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <Link href="/signUp" className="text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

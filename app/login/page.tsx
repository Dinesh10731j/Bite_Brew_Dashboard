"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Coffee, ArrowRight, Lock, Mail, Loader2 } from "lucide-react";
import { loginFormValues } from "@/lib/types";
import { UseUserLogin } from "@/hooks/useLogin";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = UseUserLogin();
  const { isError, isPending, mutate } = loginMutation;
  const currentUser = useCurrentUser();

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("reason");
    if (reason === "forbidden") {
      toast.error("Forbidden: your role cannot access the dashboard.");
    }
    if (reason === "unauthorized") {
      toast.error("Please sign in to continue.");
    }
  }, []);

  useEffect(() => {
    if (currentUser.user && currentUser.isAllowed) {
      router.replace("/dashboard");
    }
  }, [currentUser.user, currentUser.isAllowed, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: loginFormValues) => {
    mutate(data);
  };

  return (
    <main className="bg-[#F5F0E6] min-h-screen flex items-center justify-center p-4 md:p-6 selection:bg-[#8EC894] selection:text-[#0a2920]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#207659]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#8EC894]/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <section className="relative w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white">
        <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0a2920] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-12">
              <Coffee className="text-[#8EC894]" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bite Brew Premium</span>
            </div>

            <h2 className="text-7xl font-black uppercase italic leading-[0.85] tracking-tighter">
              Crafting <br />
              <span className="text-[#8EC894]">Your</span> <br />
              Morning.
            </h2>

            <p className="mt-8 text-white/50 max-w-[280px] font-medium leading-relaxed">
              Experience the art of curated beans and precise brewing techniques.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-4 border-[#0a2920] bg-[#207659] flex items-center justify-center text-[10px] font-bold overflow-hidden"
                >
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold leading-none">2,400+</p>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Daily Brewers</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-20 flex flex-col justify-center bg-white">
          <div className="mb-12">
            <div className="lg:hidden w-12 h-12 bg-[#0a2920] rounded-xl flex items-center justify-center mb-6">
              <Coffee className="text-[#8EC894]" size={24} />
            </div>
            <h1 className="text-5xl font-black text-[#0a2920] lowercase italic tracking-tighter">welcome back</h1>
            <p className="text-black/30 font-bold uppercase text-[11px] tracking-[0.3em] mt-3">
              Enter details to unlock your profile
            </p>
          </div>

          <form className="space-y-5" method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="group space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 transition-colors group-focus-within:text-[#207659]">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#207659] transition-colors"
                  size={20}
                />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" },
                  })}
                  type="email"
                  className="w-full bg-[#F5F0E6]/30 border border-black/[0.03] rounded-2xl px-14 py-5 focus:bg-white focus:ring-4 ring-[#207659]/5 outline-none transition-all font-bold text-[#0a2920] placeholder:text-black/10"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
            </div>

            <div className="group space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 transition-colors group-focus-within:text-[#207659]">
                Security Key
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#207659] transition-colors"
                  size={20}
                />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Key must be at least 6 digits" },
                  })}
                  type="password"
                  className="w-full bg-[#F5F0E6]/30 border border-black/[0.03] rounded-2xl px-14 py-5 focus:bg-white focus:ring-4 ring-[#207659]/5 outline-none transition-all font-bold text-[#0a2920] placeholder:text-black/10"
                  placeholder="********"
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase">{errors.password.message}</p>}
            </div>

            {isError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-tight">Authentication Failed. Please retry.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full overflow-hidden rounded-[1.25rem] bg-[#0a2920] py-6 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(10,41,32,0.3)] active:scale-[0.98] disabled:opacity-70"
            >
              <div className="relative z-10 flex items-center justify-center gap-3 text-white font-black uppercase text-[11px] tracking-[0.2em]">
                {isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Initialize Session
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#207659] to-[#0a2920] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-black/[0.03] flex flex-col sm:flex-row gap-6 justify-between items-center">
            <Link
              href="/signup"
              className="group text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-[#0a2920] transition-colors flex items-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-black/10 group-hover:bg-[#8EC894] transition-colors" />
              New Member?
            </Link>
            <Link
              href="/forgot-password"
              className="text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-[#0a2920] transition-colors"
            >
              Recover Access
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
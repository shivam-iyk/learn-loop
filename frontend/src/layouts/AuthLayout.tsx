import { Link, Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import { useEffect } from "react";

function Navbar() {
  return (
    <nav className="border-b p-2 sticky top-0 left-0 backdrop-blur-sm bg-white/50 z-50">
      <div className="flex items-center gap-2 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <h3 className="md:text-2xl text-xl font-cal-sans tracking-tight font-bold">
            Learn Loop
          </h3>
        </Link>
      </div>
    </nav>
  );
}

function Footer() {
  const portfolioUrl = import.meta.env.VITE_APP_PORTFOLIO_URL;

  const nav = [
    {
      title: "Login",
      path: "/login",
    },
    {
      title: "Register",
      path: "/register",
    },
    {
      title: "Forgot Password",
      path: "/forgot-password",
    },
  ];

  return (
    <footer className="bg-footer border-t border-footer-border">
      <div className="p-10">
        <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-2 text-footer-foreground">
            <Logo />
            <div>
              <h4 className="text-xl font-cal-sans tracking-tight">
                Learn Loop
              </h4>
              <p className="text-muted text-sm">
                Discover courses that inspire curiosity, build practical skills,
                and help you achieve your goals at your own pace.
              </p>
            </div>
          </div>
          <div className="flex flex-col text-footer-foreground items-center">
            <h4 className="text-xl font-semibold">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-muted font-outfit mt-4">
              {nav.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.path}
                    className="hover:underline underline-offset-2"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-footer-border p-4">
        <div className="flex justify-between items-center gap-2 text-xs text-white max-w-7xl mx-auto">
          <span>&copy; Copyrights Reserved</span>
          <span>
            Made with ❤️ by{" "}
            <Link
              to={portfolioUrl}
              className="hover:underline hover:text-accent transition-colors"
            >
              Shivam
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function AuthLayout() {
  
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    const theme =
      document.documentElement.attributes.getNamedItem("data-theme");
    if (!theme) return;
    theme.value = "light";
    document.documentElement.attributes.setNamedItem(theme);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(60.92% 0.214 256.89 / 0.5), transparent 60%)",
          }}
        />
        <div className="sm:min-h-[80vh] w-full sm:px-6 px-4">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AuthLayout;

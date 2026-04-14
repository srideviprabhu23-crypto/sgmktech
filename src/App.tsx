/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  motion, 
  useScroll, 
  useSpring, 
  useInView, 
  AnimatePresence, 
  useMotionValue, 
  useTransform 
} from "motion/react";
import { 
  Code2, 
  Rocket, 
  Target, 
  Users, 
  Globe, 
  ChevronRight, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Star,
  LogIn,
  UserPlus,
  LogOut,
  Search,
  BookOpen,
  Layout,
  Server,
  Database,
  Smartphone,
  Figma,
  Shield,
  Cpu,
  Terminal,
  Layers
} from "lucide-react";
import { useEffect, useState, useRef, createContext, useContext, FormEvent, ReactNode, useMemo, MouseEvent } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation, 
  useNavigate 
} from "react-router-dom";
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from "./lib/firebase";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";

// --- Types ---
interface Course {
  id: string;
  title: string;
  category: string;
  icon: string;
  level: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Advanced Animation Components ---

const TypingText = ({ text }: { text: string }) => {
  const characters = text.split("");
  
  return (
    <motion.span>
      {characters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.05,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Lime Disk */}
      <motion.div
        className="absolute w-[300px] h-[300px] bg-[#bef264] rounded-full opacity-40 blur-3xl"
        initial={{ x: "-10%", y: "20%" }}
        animate={{ 
          x: ["-10%", "5%", "-10%"],
          y: ["20%", "25%", "20%"],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Teal Disk */}
      <motion.div
        className="absolute w-[400px] h-[400px] bg-[#2dd4bf] rounded-full opacity-30 blur-[100px]"
        initial={{ x: "60%", y: "10%" }}
        animate={{ 
          x: ["60%", "50%", "60%"],
          y: ["10%", "20%", "10%"],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Blue Disk */}
      <motion.div
        className="absolute w-[350px] h-[350px] bg-[#3b82f6] rounded-full opacity-20 blur-[80px]"
        initial={{ x: "20%", y: "60%" }}
        animate={{ 
          x: ["20%", "30%", "20%"],
          y: ["60%", "50%", "60%"],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glass Disks (Visual Accents) */}
      <motion.div
        className="absolute w-64 h-64 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full"
        style={{ top: "30%", left: "15%", rotateX: 45, rotateY: -20 }}
        animate={{ 
          y: [0, -30, 0],
          rotateZ: [0, 10, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute w-48 h-48 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full"
        style={{ top: "50%", right: "20%", rotateX: -30, rotateY: 40 }}
        animate={{ 
          y: [0, 40, 0],
          rotateZ: [0, -15, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const BackgroundParticles = () => {
  const symbols = useMemo(() => ["{ }", "</>", "[ ]", "( )", "=>", "++", "&&", "||"], []);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <FloatingShapes />
      {symbols.map((symbol, i) => (
        <motion.div
          key={i}
          className="absolute text-brand/10 font-mono text-2xl"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            rotate: Math.random() * 360
          }}
          animate={{
            y: [null, "-20vh", "120vh"],
            rotate: [null, 360],
            opacity: [0, 0.15, 0]
          }}
          transition={{
            duration: 25 + Math.random() * 25,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </div>
  );
};

const TiltCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(50px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
};

const CursorGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2"
      style={{ x: mouseX, y: mouseY }}
    />
  );
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Courses", path: "/courses" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass py-3" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center transition-transform"
          >
            <Code2 className="text-white w-6 h-6" />
          </motion.div>
          <span className="text-xl font-display font-bold tracking-tighter">SGMK TECH</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`transition-colors ${isActive(link.path) ? "text-brand" : "text-slate-600 hover:text-brand"}`}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} className="w-6 h-6 rounded-full" alt="User" />
                <span className="text-xs truncate max-w-[100px] text-slate-700">{user.displayName || user.email}</span>
              </div>
              <button onClick={logout} className="text-slate-400 hover:text-brand transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/signup" className={`transition-colors ${isActive("/signup") ? "text-brand" : "text-slate-600 hover:text-brand"}`}>Sign Up</Link>
              <Link to="/login" className="bg-brand text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-brand/20">
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <LogIn className="w-6 h-6 rotate-90" /> : <Layout className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-200 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-lg font-medium ${isActive(link.path) ? "text-brand" : "text-slate-600"}`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-slate-200" />
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} className="w-10 h-10 rounded-full" alt="User" />
                    <span className="font-medium text-slate-700">{user.displayName || user.email}</span>
                  </div>
                  <button onClick={logout} className="flex items-center gap-2 text-red-500 font-medium">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/login" className="text-lg font-medium text-slate-600">Login</Link>
                  <Link to="/signup" className="bg-brand text-white text-center py-3 rounded-2xl font-bold">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="py-12 border-t border-slate-200 bg-white">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded flex items-center justify-center">
            <Code2 className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-display font-bold tracking-tighter">SGMK TECH</span>
        </div>
        <div className="flex gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-brand transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand transition-colors">Contact Us</a>
        </div>
        <div className="text-sm text-slate-400">
          © 2026 SGMK Tech. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

const Counter = ({ target, label, suffix = "+" }: { target: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center p-8 glass rounded-3xl">
      <div className="text-5xl font-display font-bold text-brand mb-2">
        {count}{suffix}
      </div>
      <div className="text-slate-500 font-medium uppercase tracking-widest text-xs">{label}</div>
    </div>
  );
};

// --- Pages ---

const Home = () => (
  <div className="pt-20">
    <section className="relative py-24 md:py-32 overflow-hidden min-h-[90vh] flex items-center">
      <BackgroundParticles />
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 glass rounded-full text-[10px] md:text-xs font-bold tracking-widest text-brand uppercase mb-8"
          >
            Empowering Future Innovators
          </motion.span>
          <h1 className="text-4xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[1.1] md:leading-[0.9]">
            <TypingText text="Build Your Career with" /> <br />
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-gradient"
            >
              SGMK Tech
            </motion.span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed mb-12"
          >
            Premium tech education designed for future innovators and leaders. Join our global community of learners today.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/courses" className="bg-brand text-white px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-brand/20">
              Explore Courses
            </Link>
            <Link to="/signup" className="glass px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/50 transition-colors">
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    <section className="py-24 container mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Rocket, title: "Online Learning", desc: "Access high-quality video lessons anytime, anywhere." },
          { icon: Layout, title: "Offline Classes", desc: "Interactive classroom sessions with real-time mentorship." },
          { icon: Users, title: "Expert Mentors", desc: "Learn from industry professionals with real-world experience." },
          { icon: BookOpen, title: "Internship Program", desc: "Work on live projects and gain hands-on experience." }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <TiltCard className="h-full">
              <div className="glass p-8 rounded-[2rem] hover:bg-white/50 transition-colors group h-full">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-brand w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-3xl md:text-4xl font-display font-bold mb-16"
        >
          Ready to Transform Your Future?
        </motion.h2>
        <Link to="/signup" className="bg-brand text-white px-12 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl shadow-brand/20">
          Get Started Today
        </Link>
      </div>
    </section>
  </div>
);

const About = () => (
  <div className="pt-20">
    <section className="py-24 container mx-auto px-6">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-7xl font-display font-bold mb-8">About SGMK Tech</h1>
        <p className="text-lg md:text-xl text-slate-500">Building Future-Ready Professionals Through Innovation & Excellence</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
        <div className="glass p-2 rounded-[2.5rem] aspect-video overflow-hidden">
          <img src="https://picsum.photos/seed/sgmk-about/1200/800" className="w-full h-full object-cover rounded-[2rem]" alt="About" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Who We Are</h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            SGMK Tech is a professional learning platform delivering industry-focused programs in technology, business, and digital skills. We bridge the gap between ambition and industry expertise.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[
          { icon: Target, title: "Our Mission", desc: "To make high-quality education accessible." },
          { icon: Globe, title: "Our Vision", desc: "To become globally trusted platform." },
          { icon: Star, title: "Our Values", desc: "Innovation, Excellence & Success." }
        ].map((item, i) => (
          <div key={i} className="glass p-10 rounded-[2.5rem] text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <item.icon className="text-brand w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <p className="text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-brand rounded-[3rem] p-8 md:p-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <Counter target={5000} label="Students" />
        <Counter target={20} label="Courses" />
        <Counter target={10} label="Countries" />
      </div>
    </section>
  </div>
);

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "courses"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setCourses(courseList);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "courses"));

    return () => unsubscribe();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="w-full md:w-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Courses</h1>
            <p className="text-slate-500">Master the most in-demand skills in tech.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full glass pl-12 pr-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="glass h-48 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <TiltCard>
                    <div className="glass p-6 md:p-8 rounded-3xl text-center group cursor-pointer h-full">
                      <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6 relative">
                        <div className="absolute inset-0 bg-brand/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img src={course.icon} className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform" alt={course.title} />
                      </div>
                      <h3 className="font-bold text-xs md:text-sm mb-2 line-clamp-1">{course.title}</h3>
                      <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest font-medium">{course.category}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-[3rem]">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">No courses found</h3>
            <p className="text-slate-500 mb-8">We couldn't find any courses. You can try refreshing or seeding the database.</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
              >
                Refresh Page
              </button>
              <button 
                onClick={async () => {
                  const initialCourses = [
                    { id: "full-stack", title: "Full Stack", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", level: "Advanced" },
                    { id: "aws", title: "AWS", category: "Cloud", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg", level: "Intermediate" },
                    { id: "devops", title: "DevOps", category: "Infrastructure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", level: "Advanced" },
                    { id: "web-dev", title: "Web Development", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", level: "Beginner" },
                    { id: "software-testing", title: "Software Testing", category: "QA", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg", level: "Intermediate" },
                    { id: "data-science", title: "Data Science", category: "Data", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg", level: "Advanced" },
                    { id: "machine-learning", title: "Machine Learning", category: "AI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", level: "Advanced" },
                    { id: "ai", title: "AI", category: "AI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg", level: "Expert" },
                    { id: "react", title: "React", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", level: "Intermediate" },
                    { id: "angular", title: "Angular", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg", level: "Intermediate" },
                    { id: "nodejs", title: "Node.js", category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", level: "Intermediate" },
                    { id: "spring-boot", title: "Spring Boot", category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg", level: "Advanced" },
                    { id: "cyber-security", title: "Cyber Security", category: "Security", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", level: "Expert" },
                    { id: "blockchain", title: "Blockchain", category: "Web3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ethereum/ethereum-original.svg", level: "Advanced" },
                    { id: "ui-ux", title: "UI/UX Design", category: "Design", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", level: "Beginner" },
                    { id: "c-prog", title: "C", category: "Programming", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", level: "Beginner" },
                    { id: "cpp-prog", title: "C++", category: "Programming", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", level: "Intermediate" },
                    { id: "iot", title: "IOT", category: "Hardware", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg", level: "Intermediate" },
                    { id: "java-prog", title: "Java", category: "Programming", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", level: "Intermediate" },
                    { id: "python-prog", title: "Python", category: "Programming", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", level: "Beginner" },
                    { id: "adv-excel", title: "Advance Excel", category: "Business", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg", level: "Intermediate" },
                    { id: "php-prog", title: "PHP", category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", level: "Intermediate" },
                    { id: "mysql-db", title: "MySQL", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", level: "Intermediate" },
                    { id: "mongodb-db", title: "MongoDB", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", level: "Intermediate" },
                    { id: "ethical-hacking", title: "Ethical Hacking", category: "Security", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg", level: "Expert" },
                    { id: "kubernetes", title: "Kubernetes", category: "Infrastructure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg", level: "Expert" },
                    { id: "power-bi", title: "Power BI", category: "Data", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powerbi/powerbi-original.svg", level: "Intermediate" },
                    { id: "tableau", title: "Tableau", category: "Data", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tableau/tableau-original.svg", level: "Intermediate" },
                    { id: "flutter", title: "Flutter", category: "Mobile", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", level: "Intermediate" },
                    { id: "android-dev", title: "Android Development", category: "Mobile", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", level: "Intermediate" },
                    { id: "ios-dev", title: "iOS Development", category: "Mobile", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg", level: "Advanced" },
                    { id: "graphic-design", title: "Graphic Design", category: "Design", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg", level: "Beginner" }
                  ];
                  for (const c of initialCourses) {
                    const { id, ...data } = c;
                    await setDoc(doc(db, "courses", id), data, { merge: true });
                  }
                  window.location.reload();
                }} 
                className="bg-brand text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-brand/20"
              >
                Seed Database
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-[2.5rem]"
      >
        <h2 className="text-3xl font-display font-bold mb-8 text-center">Welcome Back</h2>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full glass px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full glass px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-brand text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-brand/20">
            Login
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or continue with</span></div>
        </div>

        <button 
          onClick={() => loginWithGoogle().then(() => navigate("/"))}
          className="w-full glass py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Google Account
        </button>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account? <Link to="/signup" className="text-brand font-bold">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName: name,
        createdAt: new Date().toISOString(),
        role: "student"
      });
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-[2.5rem]"
      >
        <h2 className="text-3xl font-display font-bold mb-8 text-center">Create Account</h2>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full glass px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full glass px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full glass px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-brand text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-brand/20">
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-brand font-bold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

// --- Auth Provider ---

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(loading && false);
      if (u) {
        // Ensure user doc exists
        const userRef = doc(db, "users", u.uid);
        getDoc(userRef).then(snap => {
          if (!snap.exists()) {
            setDoc(userRef, {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              createdAt: new Date().toISOString(),
              role: "student"
            });
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// --- App Root ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Seed data if needed
  useEffect(() => {
    const seed = async () => {
      try {
        const initialCourses = [
          { id: "full-stack", title: "Full Stack", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", level: "Advanced" },
          { id: "aws", title: "AWS", category: "Cloud", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg", level: "Intermediate" },
          { id: "devops", title: "DevOps", category: "Infrastructure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", level: "Advanced" },
          { id: "web-dev", title: "Web Development", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", level: "Beginner" },
          { id: "software-testing", title: "Software Testing", category: "QA", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg", level: "Intermediate" },
          { id: "data-science", title: "Data Science", category: "Data", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg", level: "Advanced" },
          { id: "machine-learning", title: "Machine Learning", category: "AI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", level: "Advanced" },
          { id: "ai", title: "AI", category: "AI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg", level: "Expert" },
          { id: "react", title: "React", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", level: "Intermediate" },
          { id: "angular", title: "Angular", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg", level: "Intermediate" },
          { id: "nodejs", title: "Node.js", category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", level: "Intermediate" },
          { id: "spring-boot", title: "Spring Boot", category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg", level: "Advanced" },
          { id: "cyber-security", title: "Cyber Security", category: "Security", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", level: "Expert" },
          { id: "blockchain", title: "Blockchain", category: "Web3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ethereum/ethereum-original.svg", level: "Advanced" },
          { id: "ui-ux", title: "UI/UX Design", category: "Design", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", level: "Beginner" },
          { id: "c-prog", title: "C", category: "Programming", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", level: "Beginner" },
          { id: "cpp-prog", title: "C++", category: "Programming", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", level: "Intermediate" },
          { id: "iot", title: "IOT", category: "Hardware", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg", level: "Intermediate" },
          { id: "java-prog", title: "Java", category: "Programming", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", level: "Intermediate" },
          { id: "python-prog", title: "Python", category: "Programming", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", level: "Beginner" },
          { id: "adv-excel", title: "Advance Excel", category: "Business", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg", level: "Intermediate" },
          { id: "php-prog", title: "PHP", category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", level: "Intermediate" },
          { id: "mysql-db", title: "MySQL", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", level: "Intermediate" },
          { id: "mongodb-db", title: "MongoDB", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", level: "Intermediate" },
          { id: "ethical-hacking", title: "Ethical Hacking", category: "Security", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg", level: "Expert" },
          { id: "kubernetes", title: "Kubernetes", category: "Infrastructure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg", level: "Expert" },
          { id: "power-bi", title: "Power BI", category: "Data", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powerbi/powerbi-original.svg", level: "Intermediate" },
          { id: "tableau", title: "Tableau", category: "Data", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tableau/tableau-original.svg", level: "Intermediate" },
          { id: "flutter", title: "Flutter", category: "Mobile", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", level: "Intermediate" },
          { id: "android-dev", title: "Android Development", category: "Mobile", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", level: "Intermediate" },
          { id: "ios-dev", title: "iOS Development", category: "Mobile", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg", level: "Advanced" },
          { id: "graphic-design", title: "Graphic Design", category: "Design", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg", level: "Beginner" }
        ];

        console.log("Starting course seeding...");
        for (const c of initialCourses) {
          const { id, ...data } = c;
          await setDoc(doc(db, "courses", id), data, { merge: true });
        }
        console.log("Seeding complete!");
      } catch (error) {
        console.error("Seeding failed:", error);
        handleFirestoreError(error, OperationType.WRITE, "courses/seed");
      }
    };
    seed();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-bg-dark selection:bg-brand selection:text-black relative overflow-hidden">
          <CursorGlow />
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60] origin-left"
            style={{ scaleX }}
          />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

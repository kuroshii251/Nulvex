import logo from "../../public/logo.png";
import Image from "next/image";

const C = {
  border: "rgba(76,150,255,0.14)",
  text: "#e7edf5",
  muted: "#66768a",
  muted2: "#8494a8",
};

function Footer() {
  return (
    <footer className="pt-14 pb-8 px-7">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 pb-11">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image src={logo} alt="logo" width={600} height={600} />
            </div>            <span className="text-lg font-bold tracking-tight text-white uppercase">
              NULVEX
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
            The threat intelligence platform for researchers, developers, and
            security teams who need signal, not noise.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          <div>
            <h5
              className="text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ color: C.muted2 }}
            >
              Platform
            </h5>
            <ul className="text-xs space-y-2.5" style={{ color: C.muted }}>
              <li><a href="#">CVE database</a></li>
              <li><a href="#">Security tools</a></li>
              <li><a href="#">API docs</a></li>
            </ul>
          </div>
          <div>
            <h5
              className="text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ color: C.muted2 }}
            >
              Company
            </h5>
            <ul className="text-xs space-y-2.5" style={{ color: C.muted }}>
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5
              className="text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ color: C.muted2 }}
            >
              Legal
            </h5>
            <ul className="text-xs space-y-2.5" style={{ color: C.muted }}>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">Terms of service</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto pt-7 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10.5px] font-medium"
        style={{ borderColor: C.border, color: C.muted, fontFamily: "monospace" }}
      >
        <p>© 2026 NULVEX INTELLIGENCE SYSTEMS. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}

export default Footer;
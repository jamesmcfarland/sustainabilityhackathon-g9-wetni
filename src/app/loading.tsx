import Image from "next/image";
import qubLogo from "@/images/qub-white.png";
export default function Page() {
  return (
    <div
      className="h-screen w-screen m-0 p-0 flex flex-col"
      style={{ backgroundColor: "#87CEEB" }}
    >
      <nav className="flex justify-between items-center p-4 backdrop-blur-md bg-white/30 fixed w-full z-50 text-white drop-shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight font-serif">wetni</h1>

        <div className="flex items-center gap-2">
          <Image src={qubLogo} alt="qub logo" height={50} />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">
              2025 EEECS Sustainability Hackathon - Water
            </h1>
            <div className="text-md font-normal">Group 9</div>
          </div>
        </div>
      </nav>
      <div className="w-full h-full"></div>
    </div>
  );
}

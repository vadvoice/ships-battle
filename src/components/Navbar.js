import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-center items-center px-2 py-2 bg-current absolute w-screen">
      <Link href="/" className="text-red-400 font-bold mx-2">Home</Link>
      <Link href="/game" className="text-red-400 font-bold mx-2">Game</Link>
      <Link href="/about" className="text-red-400 font-bold mx-2">About</Link>
    </nav>
  )
}
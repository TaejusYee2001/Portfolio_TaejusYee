import Link from 'next/link'; 

const Navbar = () => {
    return (
        <nav className="navbar p-8 bg-transparent w-full max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-left">
                    <div className="font-thermadiva text-sky-400 text-6xl">TAEJUS YEE</div>
                    <div className='font-jura text-slate-400'>Art, Mathematics, and Computer Science Enthusiast</div>
                </div>
                <div className="flex space-x-4 font-thermadiva">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/about">About</NavLink>
                    <NavLink href="/contact">Contact</NavLink>
                </div>
            </div>
        </nav>
    )
}

const NavLink = ({ href, children }) => {
    return (
        <Link href={href}>
            <span className="text-sky-400 hover:text-gray-300">{children}</span>
        </Link>
    )
}

export default Navbar
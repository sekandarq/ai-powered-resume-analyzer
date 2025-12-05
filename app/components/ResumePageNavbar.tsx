import {Link} from "react-router"

const ResumePageNavbar = () => {
  return (
    <nav className = "navbar">
        <Link to="/" className="back-button">
            <img src="/icons/back.svg" alt="logo" className="w-4 h-4"></img>
            <span className="p-0.5">Back to Home Page</span>
        </Link> 

        <Link to="/">
        <p className="text-2xl font-bold text-gradient">ResuMatch</p>
        </Link>
            
    </nav>
  )
}

export default ResumePageNavbar

import { useEffect } from 'react'
import { usePuterStore } from '~/lib/puter'
import { Link, useLocation, useNavigate } from "react-router";
import Card from '~/components/ui/Card';
import { buttonVariants } from '~/components/ui/Button';
import { cn } from '~/lib/utils';
import { buildMeta } from '~/lib/meta';

export const meta = () =>
    buildMeta(
        "ResuMatch | Login",
        "Log into ResuMatch to create, save, and review AI-powered resume analyses.",
        { path: "/auth", noIndex: true }
    );

const Auth = () => {
    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const requestedNext = new URLSearchParams(location.search).get("next");
    const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
        ? requestedNext
        : "/";
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, navigate, next]);

  return (
    <main className='app-shell flex min-h-screen items-center justify-center px-4'>
        <div className="gradient-border w-full max-w-4xl">
            <Card className='rounded-[30px] p-8 sm:p-10'>
                <section className='flex flex-col gap-8'>
                <div className='flex flex-col items-center gap-4 text-center'>
                    <span className="hero-pill">AI Resume Intelligence</span>
                    <h1>Welcome to <span className="text-gradient">ResuMatch</span></h1>
                    <h2 className='max-w-2xl text-slate-600'>Sign in to manage resume analyses, review ATS feedback, and keep each application tailored to your <span className="text-gradient-highlight">desired role</span>.</h2>
                </div>
                <div className='grid gap-3 rounded-[24px] border border-slate-200/70 bg-white/70 p-4 text-left sm:grid-cols-3'>
                    <div className="feature-stat min-h-0">
                      <p className="label">Analyze</p>
                      <p className="value text-2xl">ATS</p>
                    </div>
                    <div className="feature-stat min-h-0">
                      <p className="label">Match</p>
                      <p className="value text-2xl">Keywords</p>
                    </div>
                    <div className="feature-stat min-h-0">
                      <p className="label">Prepare</p>
                      <p className="value text-2xl">Interview</p>
                    </div>
                </div>
                <div className='flex flex-col justify-center gap-3 sm:flex-row'>
                    {isLoading ? (
                        <button className='auth-button animate-pulse'>
                            <p>Signing you in ... </p>
                        </button>
                       ) : (
                        <>  
                        {auth.isAuthenticated ? (
                            <button className='auth-button' onClick={auth.signOut}>
                                <p>Log Out</p>
                            </button>
                        ) : (
                            <button className='auth-button' onClick={auth.signIn}>
                                <p>Log In</p>
                            </button>
                        )}
                        </>

                       )}
                    <Link
                        to="/"
                        className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "text-center sm:min-w-44")}
                    >
                        Back to homepage
                    </Link>
                </div>
                </section>
            </Card>
        </div>

    </main>
    )
}

export default Auth

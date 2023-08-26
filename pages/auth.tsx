import axios from "axios";
import { useCallback, useState } from "react";
import Input from "@/components/input";
import { getSession, signIn } from 'next-auth/react';
import { NextPageContext } from 'next';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';


export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {}
    }
}

const Auth = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [variant, setVariant] = useState('login');

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
    }, []);

    const login = useCallback(async () => {
        try {
            await signIn('credentials', {
                email,
                password,
                callbackUrl: '/profiles'
            });
        } catch (error) {
            console.log(error);
        }
    }, [email, password]);

    const register = useCallback(async () => {
        try {
            await axios.post('/api/register', {
                email,
                name,
                password
            });

            login();
        } catch (error) {
            console.log(error);
        }
    }, [email, name, password, login]);

    return (
        <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <div className="text-5xl text-green-500 font-black text-left px-8 py-4 tracking-tight select-none">
                    Movie Journal
                </div>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 p-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === 'login' ? 'Sign In' : 'Start new Journal'}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {variant === 'register' && (
                                <Input
                                    label="Username"
                                    id="name"
                                    value={name}
                                    onChange={(event: any) => setName(event.target.value)}
                                />
                            )}
                            <Input
                                label="Email"
                                id="email"
                                value={email}
                                type="email"
                                onChange={(event: any) => setEmail(event.target.value)}
                            />
                            <Input
                                label="Password"
                                id="password"
                                value={password}
                                type="password"
                                onChange={(event: any) => setPassword(event.target.value)}
                            />
                        </div>
                        <button onClick={variant === 'login' ? login : register} className="bg-green-500 py-3 text-white rounded-md w-full mt-10 hover:bg-green-600 transition">
                            {variant === 'login' ? 'Log In' : 'Sign Up'}
                        </button>
                        <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                            <div
                                onClick={() => signIn('google', { callbackUrl: '/profiles' })}
                                className="
                                    w-10
                                    h-10 
                                    bg-white 
                                    rounded-full 
                                    flex 
                                    items-center 
                                    justify-center 
                                    cursor-pointer
                                    hover:opacity-80
                                    transition
                                "
                            >
                                <FcGoogle size={25} />
                            </div>
                            <div
                                onClick={() => signIn('github', { callbackUrl: '/profiles' })}
                                className="
                                    w-10
                                    h-10 
                                    bg-white 
                                    rounded-full 
                                    flex 
                                    items-center 
                                    justify-center 
                                    cursor-pointer
                                    hover:opacity-80
                                    transition
                                "
                            >
                                <FaGithub size={25} />
                            </div>
                        </div>
                        <p className="text-neutral-500 mt-12 text-center">
                            {variant === 'login' ? 'First time here?' : 'Already have a Journal?'}
                            <span onClick={toggleVariant} className="text-white ml-1 cursor-pointer hover:text-green-500 transition">
                                {variant === 'login' ? 'Start a new Journal' : 'Log In'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
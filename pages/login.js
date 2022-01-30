import React from 'react'
import { getProviders, signIn } from 'next-auth/react'

function Login({ providers }) {
    return (
        <div className='flex flex-col items-center justify-center bg-black min-h-screen w-full'>
            <img className='w-52 mb-5'
                src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                alt="spotify logo" />

            {Object.values(providers).map((provider) => (
                <div key={provider.name} >
                    <button className='bg-[#10D860] text-white rounded-full p-4'
                        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                    >
                        Login with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Login

export async function getServerSideProps() {
    const providers = await getProviders()

    return {
        props: {
            providers
        }
    }
}

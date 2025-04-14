// import Header from '@/components/custom/Header'
// import { UserButton } from '@clerk/clerk-react'
// import { AtomIcon, Edit, Share2 } from 'lucide-react'
// import React from 'react'

// function Home() {
//   return (
//     <div>
//       <Header/>
//       <div>
//       {/* <img src={'/grid.svg'} className="absolute z-[-10] w-full" 
//       width={1200} height={300} /> */}
//       {/* <Header/> */}
//      <section className=" z-50">
//     <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">

//         <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
//           Build Your Resume <span className='text-primary'>With AI</span> </h1>
//         <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Effortlessly Craft a Standout Resume with Our AI-Powered Builder</p>
//         <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
//             <a href="/dashboard" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
//                 Get Started
//                 <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
//             </a>

//         </div>

//     </div>
// </section>
// <section className="py-8 bg-white z-50 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
// <h2 className="font-bold text-3xl">How it Works?</h2>
// <h2 className="text-md text-gray-500">Give mock interview in just 3 simplar easy step</h2>

// <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//       <a
//         className="block rounded-xl border bg-white
//          border-gray-200 p-8 shadow-xl transition
//          hover:border-pink-500/10 hover:shadow-pink-500/10"
//         href="#"
//       >
//        <AtomIcon className='h-8 w-8'/>

//         <h2 className="mt-4 text-xl font-bold text-black">Write promot for your form</h2>

//         <p className="mt-1 text-sm text-gray-600">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
//           distinctio alias voluptatum blanditiis laudantium.
//         </p>
//       </a>

//       <a
//         className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
//         href="#"
//       >
//       <Edit className='h-8 w-8'/>

//         <h2 className="mt-4 text-xl font-bold text-black">Edit Your form </h2>

//         <p className="mt-1 text-sm text-gray-600">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
//           distinctio alias voluptatum blanditiis laudantium.
//         </p>
//       </a>

//       <a
//         className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
//         href="#"
//       >
//       <Share2 className='h-8 w-8' />

//         <h2 className="mt-4 text-xl font-bold text-black">Share & Start Accepting Responses</h2>

//         <p className="mt-1 text-sm text-gray-600">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
//           distinctio alias voluptatum blanditiis laudantium.
//         </p>
//       </a>


//     </div>

//     <div className="mt-12 text-center">
//       <a
//         href="/sign-in"
//         className="inline-block rounded bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400"
//       >
//         Get Started Today
//       </a>
//     </div>
//     </section>
//   </div>

//     </div>
//   )
// }

// export default Home


import React from 'react';
import Header from '@/components/custom/Header';
import { AtomIcon, Edit, Share2 } from 'lucide-react';

function Home() {
  return (
    <div>
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white">
  <div className="container mx-auto px-6 py-16 text-center">
    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
      Build Your <span className="text-yellow-300">Perfect Resume</span> with AI
    </h1>
    <p className="mt-4 text-lg md:text-xl">
      Effortlessly craft a standout resume with our AI-powered builder. Save time and land your dream job!
    </p>
    <div className="mt-8 flex justify-center space-x-4">
      <a
        href="/dashboard"
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-500 hover:scale-105 transition-transform duration-300"
      >
        Get Started
      </a>
    </div>
  </div>
  <img
    src="/hero.png"
    alt="Hero Illustration"
    className="mx-auto mt-8 max-w-4xl h-auto object-contain"
/>
  
</section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-2 text-gray-600">Create your resume in just 3 simple steps</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
            <AtomIcon className="h-12 w-12 text-blue-600 mx-auto animate-bounce" />
              <h3 className="mt-4 text-xl font-semibold">Write Your Details</h3>
              <p className="mt-2 text-gray-600">
                Provide your personal and professional details to get started.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
            <Edit className="h-12 w-12 text-blue-600 mx-auto animate-bounce" />
              <h3 className="mt-4 text-xl font-semibold">Edit Your Resume</h3>
              <p className="mt-2 text-gray-600">
                Customize your resume with our easy-to-use editor.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
            <Share2 className="h-12 w-12 text-blue-600 mx-auto animate-bounce" />
              <h3 className="mt-4 text-xl font-semibold">Share & Download</h3>
              <p className="mt-2 text-gray-600">
                Share your resume or download it in multiple formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Ready to Build Your Resume?</h2>
          <p className="mt-4 text-lg">
            Join thousands of professionals who have created their resumes with us.
          </p>
          <a
            href="/dashboard"
            className="mt-6 inline-block px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Get Started Now
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;
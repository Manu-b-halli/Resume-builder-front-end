// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import FormSection from '../../components/FormSection';
// import ResumePreview from '../../components/ResumePreview';
// import { ResumeInfoContext } from '@/context/ResumeInfoContext';
// import dummy from '../../../../data/dummy'; // Fixed import
// import GlobalApi from './../../../../../service/GlobalApi';

// function EditResume() {
//     const {resumeId}=useParams();
//     const [resumeInfo,setResumeInfo]=useState();
//     useEffect(()=>{
       
//         GetResumeInfo();
//     },[])


//     const GetResumeInfo=()=>{
//         GlobalApi.GetResumeById(resumeId).then(resp=>{
//           console.log(resp.data.data);
//           setResumeInfo(resp.data.data);
//         })
//     }

//   return (
//     <ResumeInfoContext.Provider value={{resumeInfo,setResumeInfo}}>
//     <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
//         {/* Form Section  */}
//           <FormSection/>
//         {/* Preview Section  */}
//          <ResumePreview/>
//     </div>
//     </ResumeInfoContext.Provider>
//   )
// }

// export default EditResume



import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from './../../../../../service/GlobalApi';

// Create loading components for each section
const FormSectionLoading = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-40 bg-gray-200 rounded mb-4"></div>
    <div className="h-40 bg-gray-200 rounded mb-4"></div>
    <div className="h-40 bg-gray-200 rounded"></div>
  </div>
);

const PreviewLoading = () => (
  <div className="animate-pulse bg-white rounded-md shadow-md p-6 h-[842px] w-full">
    <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
  </div>
);

// Lazy load the heavy components
const FormSection = lazy(() => import('../../components/FormSection'));
const ResumePreview = lazy(() => import('../../components/ResumePreview'));

function EditResume() {
    const { resumeId } = useParams();
    const [resumeInfo, setResumeInfo] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetResumeInfo();
    }, []);

    const GetResumeInfo = () => {
        setLoading(true);
        GlobalApi.GetResumeById(resumeId)
            .then(resp => {
                console.log(resp.data.data);
                setResumeInfo(resp.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching resume:", error);
                setLoading(false);
            });
    };

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
                {/* Form Section */}
                <Suspense fallback={<FormSectionLoading />}>
                    <FormSection />
                </Suspense>
                
                {/* Preview Section */}
                <Suspense fallback={<PreviewLoading />}>
                    <ResumePreview />
                </Suspense>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default EditResume;
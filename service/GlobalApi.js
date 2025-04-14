// import axios from "axios";


// const API_KEY=import.meta.env.VITE_STRAPI_API_KEY;
// const axiosClient=axios.create({
//     baseURL:import.meta.env.VITE_API_BASE_URL+"/api/",
//     // hhts://localhost:1337/api/",
//     headers:{
//         'Content-Type':'application/json',
//         'Authorization':`Bearer ${API_KEY}`
//     }
// })


// const CreateNewResume=(data)=>axiosClient.post('/user-resumes',data);

// const GetUserResumes=(userEmail)=>axiosClient.get('/user-resumes?filters[userEmail][$eq]='+userEmail);

// const UpdateResumeDetail=(id,data)=>axiosClient.put('/user-resumes/'+id,data)

// const GetResumeById=(id)=>axiosClient.get('/user-resumes/'+id+"?populate=*")

// const DeleteResumeById=(id)=>axiosClient.delete('/user-resumes/'+id)

// export default{
//     CreateNewResume,
//     GetUserResumes,
//     UpdateResumeDetail,
//     GetResumeById,
//     DeleteResumeById
// }




// src/service/GlobalApi.js
import axios from "axios";

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://resume-maker-manu.onrender.com/';

const axiosClient = axios.create({
    baseURL: BASE_URL + "/api/",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY ? `Bearer ${API_KEY}` : undefined
    }
});

// Get user resumes
const GetUserResumes = (userEmail) => {
    return axiosClient.get('/user-resumes').then(response => {
        const allResumes = response.data.data || [];
        // Filter by userEmail
        const userResumes = allResumes.filter(resume => {
            return resume.attributes?.userEmail === userEmail;
        });
        
        // Transform data to match frontend expectations
        const transformedData = userResumes.map(resume => ({
            id: resume.id,
            // Map resumeId to documentId for frontend compatibility
            documentId: resume.attributes.resumeId,
            ...resume.attributes
        }));
        
        return { 
            data: { 
                data: transformedData 
            }
        };
    });
};

const CreateNewResume = (data) => {
    // Make sure we're using resumeId in Strapi
    const adaptedData = {
        data: {
            userName: data.data.userName,
            userEmail: data.data.userEmail,
            resumeId: data.data.resumeId, // Keep as resumeId for Strapi
            title: data.data.title,
            // Add other fields as needed
        }
    };
    
    return axiosClient.post('/user-resumes', adaptedData);
};

const UpdateResumeDetail = (id, data) => {
    return axiosClient.put('/user-resumes/' + id, {
        data: data.data
    });
};

const GetResumeById = (id) => {
  // Add error handling and logging
  console.log("Fetching resume with ID:", id);
  return axiosClient.get(`/user-resumes/${id}?populate=*`)
    .catch(error => {
      console.error("Error fetching resume:", error.response || error);
      throw error;
    });
};

const DeleteResumeById = (id) => axiosClient.delete('/user-resumes/' + id);

export default {
    CreateNewResume,
    GetUserResumes,
    UpdateResumeDetail,
    GetResumeById,
    DeleteResumeById
};
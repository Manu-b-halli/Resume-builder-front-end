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


import axios from "axios";

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

// ✅ Clean up BASE_URL (remove trailing slash just in case)
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://resume-maker-manu.onrender.com').replace(/\/+$/, '');

const axiosClient = axios.create({
    baseURL: BASE_URL + "/api/",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY ? `Bearer ${API_KEY}` : undefined
    }
});

// ✅ Get user resumes
const GetUserResumes = (userEmail) => {
    return axiosClient.get('/user-resumes').then(response => {
        const allResumes = response.data.data || [];

        const userResumes = allResumes.filter(resume => {
            return resume.attributes?.userEmail === userEmail;
        });

        const transformedData = userResumes.map(resume => ({
            id: resume.id,
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

// ✅ Create new resume
const CreateNewResume = (data) => {
    const adaptedData = {
        data: {
            userName: data.data.userName,
            userEmail: data.data.userEmail,
            resumeId: data.data.resumeId,
            title: data.data.title,
        }
    };

    return axiosClient.post('/user-resumes', adaptedData);
};

// ✅ Update resume
const UpdateResumeDetail = (id, data) => {
    return axiosClient.put('/user-resumes/' + id, {
        data: data.data
    });
};

// ✅ Get resume by ID with error handling
const GetResumeById = (id) => {
    console.log("Fetching resume with ID:", id);
    return axiosClient.get(`/user-resumes/${id}?populate=*`)
        .catch(error => {
            console.error("Error fetching resume:", error.response || error);
            throw error;
        });
};

// ✅ Delete resume
const DeleteResumeById = (id) => axiosClient.delete('/user-resumes/' + id);

export default {
    CreateNewResume,
    GetUserResumes,
    UpdateResumeDetail,
    GetResumeById,
    DeleteResumeById
};
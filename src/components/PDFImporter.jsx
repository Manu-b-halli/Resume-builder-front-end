// src/components/PDFImporter.jsx
import React, { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import GlobalApi from './../../service/GlobalApi';
import { toast } from 'sonner';
// import { AIChatSession } from '@/service/GoogleAIService';
import { v4 as uuidv4 } from 'uuid';

function PDFImporter() {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  // Optimized drag handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) setIsDragging(false);
  }, [isDragging]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      processPDF(file);
    } else {
      toast.error('Please drop a PDF file');
    }
  }, []);

  // Read PDF file as base64
  const readFileAsBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Process PDF with AI extraction
  const processPDF = async (file) => {
    if (loading) return;
    setLoading(true);
    
    try {
      toast.info(`Processing ${file.name}...`);
      
      // 1. Read the PDF file
      const pdfBase64 = await readFileAsBase64(file);
      
      // 2. Send to AI for extraction (using first 2000 chars as sample)
      const prompt = `
        I have a resume in PDF format that I've converted to base64. 
        The file is called "${file.name}" and here's a sample of the base64 content: 
        ${pdfBase64.substring(0, 2000)}...
        
        Please extract the key information and organize it into the following JSON structure:
        {
          "personalInfo": {
            "fullName": "",
            "email": "",
            "phone": "",
            "location": "",
            "jobTitle": ""
          },
          "summary": "",
          "experience": [
            {
              "title": "",
              "company": "",
              "location": "",
              "startDate": "",
              "endDate": "",
              "bulletPoints": []
            }
          ],
          "education": [
            {
              "degree": "",
              "institution": "",
              "location": "",
              "startDate": "",
              "endDate": "",
              "bulletPoints": []
            }
          ],
          "skills": []
        }
        
        Please extract as much information as possible from the PDF. If you cannot determine any field, leave it empty.
        Return ONLY the JSON, no additional text.
      `;
      
      toast.info("Extracting information from PDF...");
      
      // 3. Send to AI for processing
      const result = await AIChatSession.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();
      
      // 4. Try to parse the response as JSON
      let extractedData;
      try {
        // Find JSON object in response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]);
          console.log("Extracted data:", extractedData);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (error) {
        console.error("Failed to parse AI response:", error);
        console.log("Raw AI response:", text);
        // Create empty structure if parsing fails
        extractedData = {
          personalInfo: { fullName: "", email: "", phone: "", location: "", jobTitle: "" },
          summary: "",
          experience: [],
          education: [],
          skills: []
        };
      }
      
      // 5. Create resume with extracted data
      const uuid = uuidv4();
      const data = {
        data: {
          title: file.name.replace('.pdf', ''),
          resumeId: uuid,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName,
          themeColor: '#4F46E5',
          // Add the extracted data
          personalDetail: extractedData.personalInfo || {},
          summery: extractedData.summary || "",
          experience: extractedData.experience || [],
          education: extractedData.education || [],
          skills: extractedData.skills || []
        }
      };
      
      // 6. Save to backend
      console.log("Sending data to backend:", data);
      const apiResponse = await GlobalApi.CreateNewResume(data);
      
      if (apiResponse?.data?.data?.id) {
        toast.success('Resume created from PDF!');
        navigate(`/dashboard/resume/${apiResponse.data.data.id}/edit`);
      } else {
        throw new Error('Failed to create resume');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error(`Failed to process PDF: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection via input
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      processPDF(file);
    }
  }, []);

  return (
    <div 
      className={`p-14 py-24 border items-center flex flex-col justify-center rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed 
        ${isDragging ? 'bg-blue-100 border-blue-400' : 'bg-blue-50 border-blue-200'}
        ${loading ? 'opacity-70' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !loading && document.getElementById('pdf-upload').click()}
    >
      <input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileSelect}
        disabled={loading}
      />
      
      {loading ? (
        <>
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-center text-blue-700">Processing PDF...</p>
        </>
      ) : (
        <>
          <svg className="h-10 w-10 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-center text-blue-700">
            {isDragging ? 'Drop PDF here' : 'Import from PDF'}
          </p>
          <p className="text-xs text-center text-gray-500 mt-1">
            {isDragging ? '' : 'Click or drag a PDF file here'}
          </p>
        </>
      )}
    </div>
  );
}

export default React.memo(PDFImporter);
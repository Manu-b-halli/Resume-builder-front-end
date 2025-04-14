// src/lib/pdfUtils.js
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// Set the worker source directly with the imported worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extracts text content from a PDF file
 * @param {File} file - PDF file to process
 * @param {Function} progressCallback - Optional callback for progress updates (0-100)
 * @returns {Promise<string>} - Promise resolving to extracted text
 */
export const extractTextFromPDF = async (file, progressCallback = null) => {
  try {
    // Read the file as ArrayBuffer
    const arrayBuffer = await readFileAsArrayBuffer(file);
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      if (progressCallback) {
        progressCallback(Math.floor((i / numPages) * 100));
      }
      
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Reads a file as ArrayBuffer
 * @param {File} file - File to read
 * @returns {Promise<ArrayBuffer>} - Promise resolving to ArrayBuffer
 */
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parses extracted text into resume sections using basic pattern matching
 * @param {string} text - Text extracted from PDF
 * @returns {Object} - Structured resume data
 */
export const parseResumeFromText = (text) => {
  // Basic extraction logic
  
  // Extract personal info
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const phoneMatch = text.match(/\b(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/);
  const nameMatch = text.match(/^([A-Z][a-z]+(?: [A-Z][a-z]+)+)/m);
  
  // Try to extract education
  const educationSection = text.match(/EDUCATION|Education|ACADEMIC|Academic(.*?)(?=EXPERIENCE|Experience|WORK|Work|EMPLOYMENT|Employment|SKILLS|Skills|$)/s);
  
  // Try to extract experience
  const experienceSection = text.match(/EXPERIENCE|Experience|WORK|Work|EMPLOYMENT|Employment(.*?)(?=EDUCATION|Education|SKILLS|Skills|CERTIFICATIONS|Certifications|$)/s);
  
  // Try to extract skills
  const skillsSection = text.match(/SKILLS|Skills|TECHNOLOGIES|Technologies|COMPETENCIES|Competencies(.*?)(?=EDUCATION|Education|EXPERIENCE|Experience|CERTIFICATIONS|Certifications|$)/s);
  
  // Build the structured data
  return {
    personalDetails: {
      name: nameMatch ? nameMatch[0].trim() : "Unknown Name",
      email: emailMatch ? emailMatch[0] : "Unknown Email",
      phone: phoneMatch ? phoneMatch[0] : "Unknown Phone",
      location: extractLocation(text) || "Unknown Location",
      jobTitle: extractJobTitle(text) || "Professional"
    },
    summary: extractSummary(text) || "Professional with experience in the industry seeking new opportunities.",
    experience: extractExperienceEntries(experienceSection ? experienceSection[1] : ""),
    education: extractEducationEntries(educationSection ? educationSection[1] : ""),
    skills: extractSkills(skillsSection ? skillsSection[1] : "")
  };
};

/**
 * Extract summary from text
 */
const extractSummary = (text) => {
  // Look for summary section
  const summarySection = text.match(/SUMMARY|Summary|PROFILE|Profile|OBJECTIVE|Objective(.*?)(?=EXPERIENCE|Experience|WORK|Work|EDUCATION|Education|SKILLS|Skills|$)/s);
  
  if (summarySection && summarySection[1]) {
    return summarySection[1].trim().substring(0, 500);
  }
  
  // If no summary found, use first paragraph that's not too short
  const paragraphs = text.split(/\n\s*\n/);
  for (const paragraph of paragraphs) {
    if (paragraph.length > 100 && paragraph.length < 500) {
      return paragraph.trim();
    }
  }
  
  return "";
};

/**
 * Extract location from text
 */
const extractLocation = (text) => {
  // This is a simple approximation
  const cityStateRegex = /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2})/;
  const match = text.match(cityStateRegex);
  return match ? `${match[1]}, ${match[2]}` : "";
};

/**
 * Extract job title from text
 */
const extractJobTitle = (text) => {
  const commonTitles = [
    "Software Engineer", "Software Developer", "Web Developer", "Full Stack Developer",
    "Frontend Developer", "Backend Developer", "Data Scientist", "Project Manager",
    "Product Manager", "UX Designer", "UI Designer", "DevOps Engineer", "QA Engineer"
  ];
  
  for (const title of commonTitles) {
    if (text.includes(title)) {
      return title;
    }
  }
  
  return "";
};

/**
 * Extract education entries
 */
const extractEducationEntries = (educationText) => {
  if (!educationText || educationText.trim().length < 10) {
    return [{
      institution: "University Name",
      degree: "Degree",
      fieldOfStudy: "Field of Study",
      startDate: "20XX",
      endDate: "20XX"
    }];
  }
  
  const educationEntries = [];
  
  // Look for patterns like "University Name - Degree - 2015-2019"
  const eduMatches = educationText.match(/([A-Z][A-Za-z\s&,]+)\s+(?:[^\n]*?)\s+([A-Za-z][A-Za-z\s']+in\s+[A-Za-z\s]+|[A-Za-z][A-Za-z\s']+)\s+(?:[^\n]*?)\s+((?:19|20)\d{2})(?:\s*-\s*((?:19|20)\d{2}|Present|Current))?/g);
  
  if (eduMatches && eduMatches.length > 0) {
    eduMatches.forEach(match => {
      const parts = match.split(/\s+-\s+|\s+,\s+|\s{2,}/);
      
      let institution = parts[0] || "Unknown Institution";
      let degree = "Degree";
      let fieldOfStudy = "Field";
      let startDate = "";
      let endDate = "";
      
      // Try to extract degree and field
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (part.includes("Bachelor") || part.includes("Master") || part.includes("PhD") || part.includes("Degree")) {
          degree = part;
        } else if (/^(?:19|20)\d{2}$/.test(part)) {
          if (!startDate) startDate = part;
          else if (!endDate) endDate = part;
        }
      }
      
      educationEntries.push({
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate: endDate || "Present"
      });
    });
  }
  
  // If no matches found, return a default entry
  if (educationEntries.length === 0) {
    educationEntries.push({
      institution: "University Name",
      degree: "Degree",
      fieldOfStudy: "Field of Study",
      startDate: "20XX",
      endDate: "20XX"
    });
  }
  
  return educationEntries;
};

/**
 * Extract experience entries
 */
const extractExperienceEntries = (experienceText) => {
  if (!experienceText || experienceText.trim().length < 10) {
    return [{
      title: "Job Title",
      company: "Company Name",
      location: "Location",
      startDate: "20XX",
      endDate: "Present",
      description: "Job description and responsibilities."
    }];
  }
  
  const experienceEntries = [];
  
  // Look for patterns like "Company Name - Job Title - 2018-Present"
  const expMatches = experienceText.match(/([A-Z][A-Za-z0-9\s&,.]+)\s+(?:[^\n]*?)\s+([A-Z][A-Za-z\s]+)\s+(?:[^\n]*?)\s+((?:19|20)\d{2})(?:\s*-\s*((?:19|20)\d{2}|Present|Current))?/g);
  
  if (expMatches && expMatches.length > 0) {
    expMatches.forEach(match => {
      const parts = match.split(/\s+-\s+|\s+,\s+|\s{2,}/);
      
      let company = parts[0] || "Unknown Company";
      let title = parts.length > 1 ? parts[1] : "Job Title";
      let location = "";
      let startDate = "";
      let endDate = "";
      let description = "";
      
      // Try to extract dates
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (/^(?:19|20)\d{2}$/.test(part)) {
          if (!startDate) startDate = part;
          else if (!endDate) endDate = part;
        } else if (part.match(/[A-Z][a-z]+,\s*[A-Z]{2}/)) {
          location = part;
        }
      }
      
      // Find the description - text following this match
      const index = experienceText.indexOf(match) + match.length;
      if (index < experienceText.length) {
        description = experienceText.slice(index, experienceText.indexOf(/([A-Z][A-Za-z0-9\s&,.]+)\s+(?:[^\n]*?)\s+([A-Z][A-Za-z\s]+)/, index) || index + 100).trim();
      }
      
      experienceEntries.push({
        title,
        company,
        location,
        startDate,
        endDate: endDate || "Present",
        description: description || "Responsible for various tasks and projects."
      });
    });
  }
  
  // If no matches found, return a default entry
  if (experienceEntries.length === 0) {
    experienceEntries.push({
      title: "Job Title",
      company: "Company Name",
      location: "Location",
      startDate: "20XX",
      endDate: "Present",
      description: "Job description and responsibilities."
    });
  }
  
  return experienceEntries;
};

/**
 * Extract skills from text
 */
const extractSkills = (skillsText) => {
  if (!skillsText || skillsText.trim().length < 5) {
    return ["JavaScript", "HTML", "CSS", "React", "Node.js"];
  }
  
  // Split by common delimiters and clean up
  const skills = skillsText
    .split(/[,•|●\n]+/)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 2 && skill.length < 30 && !skill.includes(":"));
  
  return skills.length > 0 ? skills : ["JavaScript", "HTML", "CSS", "React", "Node.js"];
};
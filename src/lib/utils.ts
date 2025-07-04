/*
  Purpose:
  The utils.ts (or utils folder) is where you put general-purpose 
  helper functions that are not tied to a specific component, hook, or service. 
  These are often utility functions that help you manipulate data, 
  format strings, validate inputs, etc.

  Common Usage:
  -Date formatting functions
  -Validation functions (e.g., isEmailValid, isPasswordStrong)
  -Data manipulation (e.g., filterData, sortByDate)
  -Math functions (e.g., calculateTotal, generateRandomID)
*/

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { supabase } from "./supabaseClient";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const johorDaerahList = [
  { label: "Johor Bahru", value: "Johor Bahru" },
  { label: "Batu Pahat", value: "Batu Pahat" },
  { label: "Kluang", value: "Kluang" },
  { label: "Kota Tinggi", value: "Kota Tinggi" },
  { label: "Muar", value: "Muar" },
  { label: "Segamat", value: "Segamat" },
  { label: "Pontian", value: "Pontian" },
  { label: "Mersing", value: "Mersing" },
  { label: "Tangkak", value: "Tangkak" },
  { label: "Kulai", value: "Kulai" },
];



// GET USER ID IN THE CACHE SESSION
let cachedSession: any = null;
export const getCachedUser = async () => {
  if (cachedSession) return cachedSession;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    cachedSession = session.user;
  }

  return cachedSession;
};


// FORMAT USER IC NO TO:  XXXXXX-XX-XXXX 
export const formatIcNO = (IcNo: string) => {

  if(IcNo == null) return null;

  const cleanedInput = IcNo.toString().replace(/\D/g, '');

  if (cleanedInput.length === 12) {
    return `${cleanedInput.slice(0, 6)}-${cleanedInput.slice(6, 8)}-${cleanedInput.slice(8)}`;
  } else {
    throw new Error('Invalid input length, expected 12 digits.');
  }
}

// FORMATE DATE TO: DD MONTHNAME YYYY | HH:MM
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const formattedDate = date.toLocaleString('en-GB', options);

  const [day, month, year, hour, minute] = formattedDate.split(/[\s,]+/);

  return `${day} ${month} ${year} | ${hour}:${minute}`;
}

// FORMAT IC NO TO : DD/MM/YYYY AND AGE
export const calculateAgeFromIC = (icNumber: string) => {

  console.log("icNumber: ",icNumber);

  if (!icNumber || icNumber.length < 6) return { dob: null, age: null };

  const dobString = icNumber.substring(0, 6);
  let year = (dobString.substring(0, 2));
  const month = dobString.substring(2, 4);
  const day = dobString.substring(4, 6);

  const currentYear = new Date().getFullYear() % 100; 
  const century = year > currentYear ? '19' : '20'; 
  const fullYear = parseInt(century + year.toString(), 10);

  // console.log("DOB Parsing Debug:");
  // console.log("IC Number:", icNumber);
  // console.log("Extracted DOB String (YYMMDD):", dobString);
  // console.log("Year (2 digits):", year);
  // console.log("Month:", month);
  // console.log("Day:", day);
  // console.log("Current Year (last 2 digits):", currentYear);
  // console.log("Assumed Century:", century);
  // console.log("Full Year:", fullYear);
  // console.log("Final DOB:", `${fullYear}-${month}-${day}`);

  const dob = new Date(`${fullYear}-${month}-${day}`);
  const now = new Date();

  let age = now.getFullYear() - dob.getFullYear();
  if (
    now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())
  ) {
    age--;
  }

  const formattedDob = `${day}/${month}/${fullYear}`;
  return {
    dob: formattedDob,
    age,
  };
};


// REMOVE IMAGE IN SUAPBASE BUCKET STORAGE
export const deleteImageFromStorage = async (imagePath: string, bucketName: string) => {
  try {

    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([imagePath]); 

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }

    console.log("Image successfully deleted from the bucket.");
  } catch (error) {
    console.error("Error deleting image:", error.message);
    alert("Gagal menghapuskan gambar.");
  }
}

// Function to titlecase a string
const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// New function to format the application level
export const formatApplicationLevel = (level: string): string => {
  if (!level) return "";
  const titleCasedLevel = toTitleCase(level.replace(/_/g, ' ')); // Replace underscores with spaces for title casing
  return `Peringkat ${titleCasedLevel}`;
};
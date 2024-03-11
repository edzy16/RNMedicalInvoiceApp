// Function to make a POST request

import { Platform } from "react-native";

// const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_URL = "https://medical-invoice-app-backend.onrender.com/api/v1/"; // Replace with your API URL
export async function postData(endpoint: string = "", data = {}) {
  console.log("Api url", API_URL + endpoint);

  const response = await fetch(API_URL + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add any other headers if needed
    },
    body: JSON.stringify(data),
  });
  return await response.json(); // Parse JSON response
}

// Function to make a POST request with multipart/form-data
// Function to make a POST request with multipart/form-data
export async function postMultipartData(
  endpoint = "",
  imageUri = null,
  userId = "",
  currentLocation = null
) {
  console.log("Api url", API_URL + endpoint, imageUri, userId, currentLocation);
  const formData = new FormData();
  const fileUri =
    Platform.OS === "android" ? imageUri : imageUri.replace("file://", "");
  const filename = fileUri.split("/").pop();
  // Fetch the image data as a blob
  imageUri &&
    formData.append("image", {
      uri: fileUri,
      name: filename,
      type: "image/jpeg",
    } as any);
  userId && formData.append("userId", userId);
  currentLocation &&
    formData.append(
      "currentLocation",
      currentLocation.coords.latitude + "," + currentLocation.coords.longitude
    );
  console.log("in postMultipartData", formData);

  const response = await fetch(API_URL + endpoint, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return await response.json(); // Parse JSON response
}

// Function to make a GET request
export async function getData(endpoint = "") {
  const response = await fetch(API_URL + endpoint);
  return await response.json(); // Parse JSON response
}

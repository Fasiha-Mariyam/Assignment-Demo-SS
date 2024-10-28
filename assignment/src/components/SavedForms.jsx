/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import FormFields from './FormFields'; // Import your FormFields component

export default function SavedForms({ savedJson }) {
  const [selectedForm, setSelectedForm] = useState("");
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [formData, setFormData] = useState(null); // State to store selected form data

  // Parse the saved JSON data if it exists
  const parsedSavedJson = savedJson.map(jsonStr => {
    try {
      return JSON.parse(jsonStr); // Parse each JSON string into an object
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null; // Return null if parsing fails
    }
  }).filter(item => item !== null); 

  const handleSelectChange = (e) => {
    setSelectedForm(e.target.value);
  };

  // Handler for the Generate button click
  const handleGenerateClick = () => {
    const selectedFormData = parsedSavedJson.find(
      (form) => form.formField === selectedForm // Match the formField with selectedForm
    );

    if (selectedFormData) {
      setFormData(selectedFormData); // Store the selected form data
      setShowForm(true); // Show the form
    }
  };

  return (
    <>
      {!showForm ? (
        <Box sx={{ mt: 5, textAlign: "center", display: "flex", justifyContent: "center", gap: 5, alignItems: "center" }}>
          <Typography variant="h5" gutterBottom>
            Select Existing Form
          </Typography>

          <Select
            value={selectedForm}
            onChange={handleSelectChange}
            displayEmpty
            fullWidth
            sx={{ mb: 2, width: "20%" }}
          >
            <MenuItem value="" disabled>
              Choose a form
            </MenuItem>
            {parsedSavedJson.map((form, index) => (
              <MenuItem key={index} value={form.formField}>
                {form.formField} {/* Display the formField name */}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            onClick={handleGenerateClick}
            disabled={!selectedForm}
            sx={{ backgroundColor: "green", textTransform: "none" }}
          >
            Generate Form
          </Button>
        </Box>
      ) : (
        formData && (
          <FormFields formJson={formData.rows} formField={formData.formField} />
        )
      )}
    </>
  );
}

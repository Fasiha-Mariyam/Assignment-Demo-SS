/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";

export default function FormFields({ formJson, formField }) {
  const [inputData, setInputData] = useState({});
  const [submissions, setSubmissions] = useState([]);
  console.log("formJson", formJson);

  const handleInputChange = (name, value) => {
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSubmission = (newSubmission) => {
    setSubmissions((prev) => {
      const updatedSubmissions = [newSubmission, ...prev];
      return updatedSubmissions.slice(0, 10);
    });
  };

  const handleSave = (event) => {
    event.preventDefault(); // Prevent default form submission
    handleSaveSubmission(inputData);
    setInputData({});
  };

  return (
    <form onSubmit={handleSave}>
      {" "}
      {/* Use form and onSubmit */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f9f9f9",
          maxWidth: 600,
          mx: "auto",
          my: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          {formField}
        </Typography>
        {formJson.map((field, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 3,
              mb: 2,
            }}
          >
            <Typography sx={{ textAlign: "center" }}>
              {field.name}:
              {field.mandatory && <span style={{ color: "red" }}> *</span>}{" "}
            </Typography>
            {(field.type === "String" || field.type === "string") && (
              <TextField
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                  },
                }}
                value={inputData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.mandatory} // Mark field as required if mandatory
              />
            )}
            {field.type === "Number" && (
              <TextField
                type="number"
                fullWidth
                variant="outlined"
                value={inputData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                  },
                }}
                required={field.mandatory} // Mark field as required if mandatory
              />
            )}
            {field.type === "Dropdown" && (
              <Select
                fullWidth
                value={inputData[field.name] || ""}
                variant="outlined"
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                  },
                }}
                required={field.mandatory} // Mark field as required if mandatory
              >
                {field.options.split(",").map((option, i) => (
                  <MenuItem key={i} value={option.trim()}>
                    {option.trim()}
                  </MenuItem>
                ))}
              </Select>
            )}
            {field.type === "Date" && (
              <TextField
                type="date"
                fullWidth
                variant="outlined"
                value={inputData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                  },
                }}
                required={field.mandatory} // Mark field as required if mandatory
              />
            )}
          </Box>
        ))}
        <Button
          type="submit" // Change button type to submit
          variant="contained"
          color="primary"
          sx={{
            mt: 4,
            padding: "10px 20px",
            textTransform: "none",
            borderRadius: 5,
          }}
        >
          Save
        </Button>
      </Box>
      {/* Save List */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" align="center">
          Last 10 Submissions
        </Typography>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {submissions.map((submission, index) => (
            <li
              key={index}
              style={{
                textAlign: "center",
                padding: "10px",
              }}
            >
              {JSON.stringify(submission)}
            </li>
          ))}
        </ul>
      </Box>
    </form>
  );
}

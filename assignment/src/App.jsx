import React, { useState } from "react";
import {
  Button,
  Box,
  TextField,
  Typography,
  Modal,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import DetailTable from "./components/DetailTable";
import FormFields from "./components/FormFields";
import SavedForms from "./components/SavedForms"; // Import SavedForms component
import * as XLSX from "xlsx"; // Library to handle Excel file import

function App() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({
    name: "",
    type: "",
    mandatory: false,
    options: "",
    dob: "", // New field for Date of Birth
    phoneNumber: "", // New field for Phone Number
  });
  const [formJson, setFormJson] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formField, setFormField] = useState("");
  const [savedJson, setSavedJson] = useState([]);
  const [showSavedJson, setShowSavedJson] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleMandatoryChange = (e) => {
    setNewRow((prev) => ({ ...prev, mandatory: e.target.checked }));
  };

  const handleSave = () => {
    if (!newRow.name || !newRow.type || !newRow.dob || !newRow.phoneNumber) {
      setErrorMessages(["All fields are required."]);
      return; // Exit the function if validation fails
    } else {
      setRows((prev) => [...prev, newRow]);
      setNewRow({
        name: "",
        type: "",
        mandatory: false,
        options: "",
        dob: "",
        phoneNumber: "",
      });
      handleClose();
    }
  };

  const handleGenerateForm = () => {
    setFormJson(rows);
    setShowForm(true);
  };

  const handleSaveJson = () => {
    const data = { rows, formField };
    const json = JSON.stringify(data, null);
    setSavedJson((prev) => [...prev, json]);
    setRows([]);
    setFormField("");
    setSnackbarOpen(true); // Show snackbar on save
  };

  const handleLoadJson = () => {
    setShowSavedJson(true); // Show the Saved JSON view
  };

  const handleDelete = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const jsonData = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );
      console.log(jsonData, "data");

      const newRows = [];

      // Initialize a flag to track if any errors occurred
      let hasErrors = false;

      jsonData.forEach((user) => {
        // Check for specific missing fields
        if (!user.Name) {
          hasErrors = true;
        }
        if (!user.Type) {
          hasErrors = true;
        }

        // If fields are present, push the user data
        if (user.Name && user.Type) {
          newRows.push({
            name: user.Name,
            type: user.Type,
            mandatory: user.Mandatory || false,
            options: user.Options || "",
            dob: user.DOB || "",
            phoneNumber: user.PhoneNumber || "",
          });
        }
      });

      if (hasErrors) {
        // Show Snackbar with concise error message about required fields
        setErrorMessages([
          "Please ensure your file has the correct columns: Name , Type , Mandatory , Options , DOB  , Phone Number ",
        ]);
      } else {
        setRows((prev) => [...prev, ...newRows]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      {!showForm && !showSavedJson ? (
        <>
          {/* Main Form View */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 5, mt: 10 }}
          >
            <Button
              variant="contained"
              sx={{ background: "grey", textTransform: "none" }}
              onClick={handleOpen}
            >
              Add Row
            </Button>
            <Button
              variant="contained"
              sx={{ background: "green", textTransform: "none" }}
              onClick={handleSaveJson}
              disabled={formField === ""}
            >
              Save JSON
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={handleLoadJson}
              disabled={savedJson.length === 0}
            >
              Load JSON
            </Button>
            <Button
              variant="contained"
              sx={{ background: "rgb(238 107 110)", textTransform: "none" }}
              onClick={handleGenerateForm}
              disabled={rows.length === 0}
            >
              Generate Form
            </Button>
            <Button
              variant="contained"
              sx={{ background: "blue", textTransform: "none" }}
              component="label"
            >
              Import Excel
              <input
                type="file"
                hidden
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
              />
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 5,
            }}
          >
            <Typography>Form Field</Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              value={formField}
              onChange={(e) => setFormField(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
            />
          </Box>

          <Box sx={{ mt: 5 }}>
            <DetailTable rows={rows} onDelete={handleDelete} />
          </Box>

          {/* Modal for Adding Row */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-row-modal"
          >
            <Box sx={{ ...modalStyle }}>
              <Typography variant="h6" gutterBottom>
                Add New Field
              </Typography>
              <TextField
                label="Name of the field"
                name="name"
                value={newRow.name}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Date of Birth (YYYYMMDD)"
                name="dob"
                value={newRow.dob}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={newRow.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Select
                name="type"
                value={newRow.type}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="String">String</MenuItem>
                <MenuItem value="Number">Number</MenuItem>
                <MenuItem value="Dropdown">Dropdown</MenuItem>
                <MenuItem value="Date">Date</MenuItem>
              </Select>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newRow.mandatory}
                    onChange={handleMandatoryChange}
                  />
                }
                label="Mandatory"
              />
              {newRow.type === "Dropdown" && (
                <TextField
                  label="Options (comma separated)"
                  name="options"
                  value={newRow.options}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  sx={{ mt: 2, mb: 2 }}
                />
              )}
              <Button variant="contained" onClick={handleSave} sx={{ mt: 2,display:"flex", }}>
                Save
              </Button>
            </Box>
          </Modal>

          {/* Snackbar for Save Notification */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleSnackbarClose} severity="success">
              Form saved successfully!
            </Alert>
          </Snackbar>

          {/* Display Errors */}
          {errorMessages.length > 0 && (
            <Snackbar
              open={errorMessages.length > 0}
              autoHideDuration={6000}
              onClose={() => setErrorMessages([])}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert onClose={() => setErrorMessages([])} severity="error">
                {errorMessages.join(", ")}
              </Alert>
            </Snackbar>
          )}
        </>
      ) : showSavedJson ? (
        <SavedForms savedJson={savedJson} onGenerateForm={setFormJson} />
      ) : (
        <FormFields formJson={formJson} formField={formField} />
      )}
    </>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default App;

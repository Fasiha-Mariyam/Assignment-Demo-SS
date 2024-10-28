/* eslint-disable react/prop-types */
import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

export default function DetailTable({ rows, onDelete }) {
  console.log(rows, "row");
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <TableContainer component={Paper} sx={{ width: "80%", maxWidth: 600 }}>
        <Table aria-label="detail table" sx={{ border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Name</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Type</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                Mandatory
              </TableCell>
              <TableCell colSpan={2} sx={{ borderRight: "1px solid #ddd" }}>
                Options
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Date</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                Phone Number
              </TableCell>
              <TableCell colSpan={2}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {row.name}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {row.type}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {row.mandatory ? "True" : "False"}
                </TableCell>
                <TableCell colSpan={2} sx={{ borderRight: "1px solid #ddd" }}>
                  {row.type === "Dropdown" ? row.options : "N/A"}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {row.dob}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {row.phoneNumber}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => onDelete(index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

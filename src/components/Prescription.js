import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import './Prescription.css';

const Prescription = () => {
    const [prescriptions, setPrescriptions] = useState([]);

    const fetchPrescriptions = async () => {
        try {
            const response = await fetch('https://joshmachpharmacy-e682e263652d.herokuapp.com/api/prescriptions');
            if (!response.ok) {
                throw new Error('Failed to fetch prescriptions');
            }
            const data = await response.json();
            setPrescriptions(data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    return (
        <Box className="prescriptions">
            <Typography variant="h4" gutterBottom>
                Prescriptions
            </Typography>
            <Box className="prescriptionTable">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Customer Message</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Image</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prescriptions.map((prescription) => (
                            <TableRow key={prescription.id}>
                                <TableCell>{prescription.customer_message}</TableCell>
                                <TableCell>{prescription.customer_email}</TableCell>
                                <TableCell>
                                    {prescription.image_path && (
                                        <img src={`https://joshmachpharmacy-e682e263652d.herokuapp.com/${prescription.image_path}`} alt="Prescription" className="prescriptionImage" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default Prescription;

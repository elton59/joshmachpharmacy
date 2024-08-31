import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, IconButton, TextField, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import axios from 'axios';

// Styled components for UI
const ChatButton = styled(Button)({
  position: 'fixed',
  bottom: '80px',
  right: '20px',
  backgroundColor: '#007bff',
  color: 'white',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  fontSize: '24px',
  cursor: 'pointer',
});

const InputContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

const FileInput = styled('input')({
  marginBottom: '10px',
  width: '100%',
});

const ImagePreview = styled('img')({
  maxWidth: '100%',
  marginBottom: '10px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const SendButton = styled(Button)({
  padding: '10px 20px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
  width: '100%',
  position: 'relative',
});

const ModalContent = styled('div')({
  position: 'relative',
  top: '50%',
  left: '50%',
  right: 'auto',
  bottom: 'auto',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '400px',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#fff',
  '@media (max-width: 600px)': {
    padding: '10px',
    width: '80%',
    maxWidth: '320px',
  },
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: '10px',
  right: '10px',
});

const Title = styled('h2')({
  marginBottom: '20px',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '20px',
  },
});

const SpinnerContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px',
});

const ChatBot = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setInputValue('');
    setEmail('');
    setImage(null);
    setIsLoading(false); // Reset loading state
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !image) {
      return;
    }
  
    setIsLoading(true); // Start loading spinner

    const formData = new FormData();
    formData.append('customer_message', inputValue.trim());
    formData.append('email', email.trim());
  
    if (image) {
      formData.append('image', image);
    }
  
    try {
      const response = await axios.post('https://joshmachpharmacy-e682e263652d.herokuapp.com/api/prescriptions/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert('Prescription sent successfully!');
  
      const emailData = {
        to: email,
        subject: 'Your Prescription Details',
        body: `Hi ${email}, your prescription has been received. We'll work on it and get back to you.`,
      };
  
      await fetch('https://joshmachpharmacy-e682e263652d.herokuapp.com/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
  
      console.log('Prescription sent:', response.data);
      closeModal();
    } catch (error) {
      console.error('Error sending prescription:', error);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div>
      <ChatButton onClick={openModal}>
        💬
      </ChatButton>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { zIndex: 1000 }, content: { padding: 0 } }}
      >
        <ModalContent>
          <CloseButton onClick={closeModal}>
            <CloseIcon />
          </CloseButton>
          <Title>Upload Prescription</Title>
          <InputContainer>
            <TextField
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              variant="outlined"
              label="Type a message..."
              fullWidth
              margin="normal"
              disabled={isLoading} // Disable input when loading
            />
            <TextField
              type="email"
              value={email}
              onChange={handleEmailChange}
              variant="outlined"
              label="Your Email"
              fullWidth
              margin="normal"
              disabled={isLoading} // Disable input when loading
            />
            <FileInput type="file" onChange={handleFileChange} disabled={isLoading} />
            {image && <ImagePreview src={URL.createObjectURL(image)} alt="Uploaded" />}
            {isLoading ? (
              <SpinnerContainer>
                <CircularProgress />
              </SpinnerContainer>
            ) : (
              <SendButton onClick={handleSendMessage}>
                Send
              </SendButton>
            )}
          </InputContainer>
        </ModalContent>
      </Modal>
    </div>
  );
};

Modal.setAppElement('#root');

export default ChatBot;

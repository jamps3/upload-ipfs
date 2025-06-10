import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  height: 60vh;
  width: 480px;
  padding: 2rem;
  background: #0e1117;
  border-radius: 12px;
  box-shadow: 0 0 15px #0ff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #e0e0e0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #00fff7;
  text-shadow: 0 0 8px #00fff7;
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  outline: none;
  background: #1c1f27;
  color: #e0e0e0;
  width: 100%;
  margin-bottom: 1rem;
  box-shadow: 0 0 5px #00fff7;
  transition: box-shadow 0.3s ease;

  &:focus {
    box-shadow: 0 0 15px #00fff7;
  }
`;

const magicalGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 8px #00fff7, 0 0 20px #00fff7;
  }
  50% {
    box-shadow: 0 0 20px #00fff7, 0 0 40px #00fff7;
  }
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  color: #0e1117;
  background: linear-gradient(135deg, #00fff7 0%, #00d9cc 100%);
  font-weight: 700;
  box-shadow: 0 0 8px #00fff7;
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    animation: ${magicalGlow} 2.5s infinite ease-in-out;
    background: linear-gradient(135deg, #00d9cc 0%, #00fff7 100%);
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  font-weight: 600;
  color: #00ff99;
  text-shadow: 0 0 8px #00ff99;
`;

const Link = styled.a`
  color: #00fff7;
  text-decoration: underline;

  &:hover {
    color: #00d9cc;
  }
`;

export function UploadToIPFS() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [hash, setHash] = useState<string | null>(null);

  async function onUpload() {
    if (!file) {
      setMsg("Please select a file first.");
      setHash(null);
      return;
    }

    try {
      setMsg("Uploading...");
      setHash(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://157.180.92.88:5001/api/v0/add", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setHash(data.Hash);
      setMsg("Upload successful!");
    } catch (e) {
      setMsg("Failed to upload file to IPFS. " + e);
      setHash(null);
    }
  }

  return (
    <Container>
      <Title>Upload File to IPFS</Title>
      <Input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <Button onClick={onUpload}>Upload</Button>
      {msg && <Message>{msg}</Message>}
      {hash && (
        <Message>
          Access your file on IPFS:{" "}
          <Link
            href={`https://ipfs.io/ipfs/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hash}
          </Link>
        </Message>
      )}
    </Container>
  );
}

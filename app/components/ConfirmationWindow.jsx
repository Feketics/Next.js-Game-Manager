"use client";
import React from "react";

export default function ConfirmationWindow({ message, onConfirm, onCancel }) 
{
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#60CA9F",
          padding: "1rem",
          borderRadius: "25px",
          textAlign: "center",
        }}
      >
        <div style={{ 
          backgroundColor: "#fff",
          padding: "1rem",
          borderRadius: "25px",
          fontSize: "1.1rem",
        }}
        >
          <p>{message}</p>
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between",
          padding: "1rem",
          }}>
          <button
            onClick={onConfirm}
            style={{ 
              backgroundColor: "#fff",
              padding: "10px 30px",
              borderRadius: "25px",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            <strong>Yes</strong>
          </button>
          <button
            onClick={onCancel}
            style={{ 
              backgroundColor: "#fff",
              padding: "10px 32px",
              borderRadius: "25px",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            <strong>No</strong>
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react"
import ReactDOM from "react-dom"
import "./Modal.css"

interface ModalProps {
  children: React.ReactNode
  onClose: () => void
}

export function Modal({ children, onClose }: ModalProps) {
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}

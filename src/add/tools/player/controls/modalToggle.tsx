import { useState, useEffect, ReactNode } from "react";

// Props interface for reusability
interface ModalToggleProps {
  storageKey?: string;
  defaultOpen?: boolean;
  children: (isModalOpen: boolean, handleToggle: () => void) => ReactNode;
}

const ModalToggle: React.FC<ModalToggleProps> = ({
  storageKey = "playlistViewState",
  defaultOpen = true,
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(defaultOpen);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const { isModalOpen } = JSON.parse(savedState);
        setIsModalOpen(isModalOpen);
      } catch (err) {
        console.error("Failed to parse modal state:", err);
      }
    }
  }, [storageKey]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ isModalOpen }));
  }, [isModalOpen, storageKey]);

  const handleToggle = () => setIsModalOpen((prev) => !prev);

  // Render children with modal state + toggle function
  return <>{children(isModalOpen, handleToggle)}</>;
};

export default ModalToggle;

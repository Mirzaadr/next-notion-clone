"use client"

import { useEffect, useState } from "react";
import SettingsModal from "@/components/modals/SettingsModal";
import CoverImageModal from "@/components/modals/CoverImageModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])
  
  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  )
}

export default ModalProvider;
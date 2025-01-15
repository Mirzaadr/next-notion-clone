"use client"

import { useEffect, useState } from "react";
import SettingsModal from "@/components/modals/SettingsModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])
  
  return (
    <>
      <SettingsModal />
    </>
  )
}

export default ModalProvider;
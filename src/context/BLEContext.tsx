// src/context/BLEContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Device } from 'react-native-ble-plx';

interface BLEContextType {
  device: Device | null;
  setDevice: (d: Device | null) => void;
}

const BLEContext = createContext<BLEContextType>({
  device: null,
  setDevice: () => {},
});

export const BLEProvider = ({ children }: { children: React.ReactNode }) => {
  const [device, setDevice] = useState<Device | null>(null);

  return (
    <BLEContext.Provider value={{ device, setDevice }}>
      {children}
    </BLEContext.Provider>
  );
};

export const useBLE = () => useContext(BLEContext);

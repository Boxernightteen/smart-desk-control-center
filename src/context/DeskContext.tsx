
import React, { createContext, useContext, useState, useEffect } from 'react';
import { bluetoothService } from '../services/BluetoothService';
import { toast } from 'sonner';

export interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: Date;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface Alert {
  id: string;
  type: 'temperature' | 'humidity' | 'desk_timeout' | 'heater_timeout' | 'custom';
  message: string;
  timestamp: Date;
  seen: boolean;
}

interface DeviceState {
  deskOn: boolean;
  deskOnTimestamp: Date | null;
  heaterOn: boolean;
  heaterOnTimestamp: Date | null;
  rgbColor: RGBColor;
}

interface DeskContextType {
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error';
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  deviceName: string | null;
  sensorData: SensorData[];
  latestSensorData: SensorData | null;
  deviceState: DeviceState;
  toggleDesk: (on?: boolean) => Promise<void>;
  toggleHeater: (on?: boolean) => Promise<void>;
  setRGBColor: (color: RGBColor) => Promise<void>;
  alerts: Alert[];
  clearAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

const DeskContext = createContext<DeskContextType | null>(null);

// Mock data generator for development purposes
const generateMockSensorData = (): SensorData => {
  return {
    temperature: 22 + Math.random() * 15, // 22-37°C
    humidity: 30 + Math.random() * 40, // 30-70%
    timestamp: new Date()
  };
};

export const DeskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [deviceState, setDeviceState] = useState<DeviceState>({
    deskOn: false,
    deskOnTimestamp: null,
    heaterOn: false,
    heaterOnTimestamp: null,
    rgbColor: { r: 128, g: 0, b: 255 }
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // This will handle the mock data generation in development
  useEffect(() => {
    let interval: number;
    
    if (connectionState === 'connected') {
      // Generate initial data
      const initialData = generateMockSensorData();
      setSensorData(prev => [...prev, initialData]);
      
      // Check for alerts based on the initial data
      checkForAlerts(initialData);
      
      // Continue generating data every 3 seconds
      interval = window.setInterval(() => {
        const newData = generateMockSensorData();
        setSensorData(prev => [...prev.slice(-29), newData]); // Keep only last 30 readings
        checkForAlerts(newData);
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionState]);

  // This will check device on-time and add alerts
  useEffect(() => {
    let deskInterval: number;
    let heaterInterval: number;
    
    // Check if desk has been on for too long
    if (deviceState.deskOn && deviceState.deskOnTimestamp) {
      deskInterval = window.setInterval(() => {
        const onTime = (new Date().getTime() - deviceState.deskOnTimestamp!.getTime()) / 1000 / 60;
        if (onTime >= 20) { // 20 minutes
          addAlert({
            type: 'desk_timeout',
            message: 'Your desk has been ON for more than 20 minutes'
          });
          // Play notification or vibrate would go here in a real app
        }
      }, 60000); // Check every minute
    }
    
    // Check if heater has been on for too long
    if (deviceState.heaterOn && deviceState.heaterOnTimestamp) {
      heaterInterval = window.setInterval(() => {
        const onTime = (new Date().getTime() - deviceState.heaterOnTimestamp!.getTime()) / 1000 / 60;
        if (onTime >= 20) { // 20 minutes
          addAlert({
            type: 'heater_timeout',
            message: 'Your heater has been ON for more than 20 minutes'
          });
          // Play notification or vibrate would go here in a real app
        }
      }, 60000); // Check every minute
    }
    
    return () => {
      if (deskInterval) clearInterval(deskInterval);
      if (heaterInterval) clearInterval(heaterInterval);
    };
  }, [deviceState.deskOn, deviceState.deskOnTimestamp, deviceState.heaterOn, deviceState.heaterOnTimestamp]);

  // Set up bluetooth service listeners
  useEffect(() => {
    const listener = {
      onConnectionStateChange: (state: 'disconnected' | 'connecting' | 'connected' | 'error', device?: BluetoothDevice) => {
        setConnectionState(state);
        setDeviceName(device?.name || null);
        
        // Show toast message based on connection state
        if (state === 'connected') {
          toast.success(`Connected to ${device?.name || 'device'}`);
        } else if (state === 'disconnected') {
          toast.info('Disconnected from device');
        } else if (state === 'error') {
          toast.error('Connection error');
        }
      },
      onDataReceived: (data: string) => {
        // Parse incoming data from Arduino
        parseIncomingData(data);
      }
    };
    
    bluetoothService.registerListener(listener);
    
    return () => {
      bluetoothService.unregisterListener(listener);
    };
  }, []);

  const parseIncomingData = (data: string) => {
    // In a real app, this would parse data from the Arduino
    // For example, "TEMP:25.5,HUM:60.2"
    
    // For this demo, we just use mock data
    console.log('Received data:', data);
  };

  const checkForAlerts = (data: SensorData) => {
    if (data.temperature > 35) {
      addAlert({
        type: 'temperature',
        message: `High temperature detected: ${data.temperature.toFixed(1)}°C`
      });
    }
    
    if (data.humidity < 30) {
      addAlert({
        type: 'humidity',
        message: `Low humidity detected: ${data.humidity.toFixed(1)}%`
      });
    }
  };

  const addAlert = ({ type, message }: { type: Alert['type'], message: string }) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      seen: false
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    
    // Show toast for new alerts
    toast.warning(message, {
      description: new Date().toLocaleTimeString()
    });
  };

  const connect = async () => {
    try {
      await bluetoothService.connect();
    } catch (error) {
      console.error('Failed to connect:', error);
      toast.error('Failed to connect to device');
    }
  };

  const disconnect = async () => {
    await bluetoothService.disconnect();
  };

  const toggleDesk = async (on?: boolean) => {
    const newState = on !== undefined ? on : !deviceState.deskOn;
    try {
      await bluetoothService.sendDeskCommand(newState);
      setDeviceState(prev => ({
        ...prev,
        deskOn: newState,
        deskOnTimestamp: newState ? new Date() : null
      }));
      toast.success(`Desk ${newState ? 'turned ON' : 'turned OFF'}`);
    } catch (error) {
      console.error('Failed to toggle desk:', error);
      toast.error('Failed to control desk');
    }
  };

  const toggleHeater = async (on?: boolean) => {
    const newState = on !== undefined ? on : !deviceState.heaterOn;
    try {
      await bluetoothService.sendHeaterCommand(newState);
      setDeviceState(prev => ({
        ...prev,
        heaterOn: newState,
        heaterOnTimestamp: newState ? new Date() : null
      }));
      toast.success(`Heater ${newState ? 'turned ON' : 'turned OFF'}`);
    } catch (error) {
      console.error('Failed to toggle heater:', error);
      toast.error('Failed to control heater');
    }
  };

  const setRGBColor = async (color: RGBColor) => {
    try {
      await bluetoothService.sendRGBCommand(color.r, color.g, color.b);
      setDeviceState(prev => ({
        ...prev,
        rgbColor: color
      }));
    } catch (error) {
      console.error('Failed to set RGB color:', error);
      toast.error('Failed to set RGB color');
    }
  };

  const clearAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const latestSensorData = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;

  const value = {
    connectionState,
    isConnected: connectionState === 'connected',
    connect,
    disconnect,
    deviceName,
    sensorData,
    latestSensorData,
    deviceState,
    toggleDesk,
    toggleHeater,
    setRGBColor,
    alerts,
    clearAlert,
    clearAllAlerts
  };

  return <DeskContext.Provider value={value}>{children}</DeskContext.Provider>;
};

export const useDesk = () => {
  const context = useContext(DeskContext);
  if (!context) {
    throw new Error('useDesk must be used within a DeskProvider');
  }
  return context;
};

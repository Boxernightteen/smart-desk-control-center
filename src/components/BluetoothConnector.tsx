
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDesk } from '@/context/DeskContext';
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  BluetoothSearching,
  LoaderCircle
} from 'lucide-react';

export function BluetoothConnector() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { 
    isConnected, 
    connectionState,
    connect, 
    disconnect,
    deviceName
  } = useDesk();

  const handleToggleConnection = async () => {
    try {
      setIsConnecting(true);
      if (isConnected) {
        await disconnect();
      } else {
        await connect();
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  let icon = <BluetoothOff className="mr-2 h-5 w-5" />;
  let buttonVariant: 'outline' | 'default' = 'outline';
  let statusText = 'Disconnected';

  if (connectionState === 'connected') {
    icon = <BluetoothConnected className="mr-2 h-5 w-5 text-green-500" />;
    buttonVariant = 'default';
    statusText = 'Connected';
  } else if (connectionState === 'connecting' || isConnecting) {
    icon = <BluetoothSearching className="mr-2 h-5 w-5 animate-pulse" />;
    statusText = 'Connecting...';
  } else if (connectionState === 'error') {
    icon = <BluetoothOff className="mr-2 h-5 w-5 text-red-500" />;
    statusText = 'Error';
  }

  return (
    <div className="flex flex-col items-center">
      <Button 
        variant={buttonVariant}
        onClick={handleToggleConnection}
        disabled={isConnecting}
        className="mb-2 transition-all duration-300 w-full"
      >
        {isConnecting ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          icon
        )}
        {isConnected ? 'Disconnect' : 'Connect'}
      </Button>
      <div className="text-sm text-muted-foreground mt-1 text-center">
        {statusText}
        {deviceName && isConnected && (
          <span className="font-medium block">{deviceName}</span>
        )}
      </div>
    </div>
  );
}

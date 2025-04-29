
type BluetoothConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

interface BluetoothEventListener {
  onConnectionStateChange: (state: BluetoothConnectionState, device?: BluetoothDevice) => void;
  onDataReceived: (data: string) => void;
}

class BluetoothService {
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private connectionState: BluetoothConnectionState = 'disconnected';
  private listeners: BluetoothEventListener[] = [];
  private decoder = new TextDecoder();
  private encoder = new TextEncoder();

  public registerListener(listener: BluetoothEventListener) {
    this.listeners.push(listener);
  }

  public unregisterListener(listener: BluetoothEventListener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyConnectionStateChange(state: BluetoothConnectionState) {
    this.connectionState = state;
    this.listeners.forEach(listener => {
      listener.onConnectionStateChange(state, this.device || undefined);
    });
  }

  private notifyDataReceived(data: string) {
    this.listeners.forEach(listener => {
      listener.onDataReceived(data);
    });
  }

  public isConnected(): boolean {
    return this.connectionState === 'connected';
  }

  public getConnectionState(): BluetoothConnectionState {
    return this.connectionState;
  }

  public getConnectedDevice(): BluetoothDevice | null {
    return this.device;
  }

  public async connect(): Promise<void> {
    try {
      if (this.isConnected()) {
        return;
      }

      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API is not supported in this browser');
      }

      this.notifyConnectionStateChange('connecting');

      // Request device with HC-05 filter (typical for Arduino Bluetooth modules)
      this.device = await navigator.bluetooth.requestDevice({
        // Use the accepted name format for HC-05 modules
        filters: [
          { namePrefix: 'HC' }, // HC-05 typically has name starting with HC
          { services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] } // Common service UUID for HC-05
        ],
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
      });

      if (!this.device) {
        throw new Error('No device selected');
      }

      // Setup disconnect listener
      this.device.addEventListener('gattserverdisconnected', () => {
        this.characteristic = null;
        this.notifyConnectionStateChange('disconnected');
      });

      const server = await this.device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to GATT server');
      }

      // Typical service UUID for HC-05 modules
      const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
      // Typical characteristic UUID for HC-05 modules
      this.characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

      // Setup notification for incoming data
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        if (value) {
          const decodedValue = this.decoder.decode(value);
          this.notifyDataReceived(decodedValue);
        }
      });

      this.notifyConnectionStateChange('connected');
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      this.notifyConnectionStateChange('error');
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.characteristic = null;
    this.notifyConnectionStateChange('disconnected');
  }

  public async sendData(data: string): Promise<void> {
    if (!this.characteristic || !this.isConnected()) {
      throw new Error('Not connected to a device');
    }

    try {
      const encoded = this.encoder.encode(data);
      await this.characteristic.writeValue(encoded);
    } catch (error) {
      console.error('Error sending data:', error);
      throw error;
    }
  }

  // Helper methods for specific commands
  public async sendDeskCommand(isOn: boolean): Promise<void> {
    await this.sendData(isOn ? 'D_ON' : 'D_OFF');
  }

  public async sendHeaterCommand(isOn: boolean): Promise<void> {
    await this.sendData(isOn ? 'H_ON' : 'H_OFF');
  }

  public async sendRGBCommand(r: number, g: number, b: number): Promise<void> {
    await this.sendData(`RGB:${r},${g},${b}`);
  }
}

// Export a singleton instance
export const bluetoothService = new BluetoothService();

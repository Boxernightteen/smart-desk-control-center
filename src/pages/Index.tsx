
import { BluetoothConnector } from "@/components/BluetoothConnector";
import { TemperatureHumidityCard } from "@/components/TemperatureHumidityCard";
import { DeskControls } from "@/components/DeskControls";
import { RGBController } from "@/components/RGBController";
import { AlertsCard } from "@/components/AlertsCard";
import { CircuitBoard } from "lucide-react";
import { useDesk } from "@/context/DeskContext";

const Index = () => {
  const { isConnected } = useDesk();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center">
          <div className="bg-desk-purple rounded-lg p-2 mr-3">
            <CircuitBoard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Smart Desk Control Center</h1>
            <p className="text-muted-foreground">Manage your desk environment</p>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <BluetoothConnector />
        </div>
      </header>
      
      {!isConnected && (
        <div className="bg-muted/20 border border-dashed border-muted rounded-lg p-8 mb-8 text-center animate-pulse-slow">
          <h2 className="text-xl font-semibold mb-2">Connect Your Device</h2>
          <p className="text-muted-foreground">
            Connect to your HC-05 Bluetooth module to control your smart desk and see sensor data.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-fade-in">
          <TemperatureHumidityCard />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <DeskControls />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <RGBController />
        </div>
        
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <AlertsCard />
        </div>
      </div>
      
      <footer className="mt-10 text-center text-sm text-muted-foreground py-4 border-t">
        <p>Smart Desk Control Center &copy; {new Date().getFullYear()}</p>
        <p className="text-xs">Built with Web Bluetooth API</p>
      </footer>
    </div>
  );
};

export default Index;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lamp, MonitorStand } from "lucide-react";
import { useDesk } from "@/context/DeskContext";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function DeskControls() {
  const { deviceState, toggleDesk, toggleHeater, isConnected } = useDesk();
  const { deskOn, heaterOn } = deviceState;
  
  const [deskTimer, setDeskTimer] = useState<string | null>(null);
  const [heaterTimer, setHeaterTimer] = useState<string | null>(null);
  
  // Update timers
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isConnected) {
      interval = setInterval(() => {
        if (deskOn && deviceState.deskOnTimestamp) {
          const diff = new Date().getTime() - deviceState.deskOnTimestamp.getTime();
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setDeskTimer(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setDeskTimer(null);
        }
        
        if (heaterOn && deviceState.heaterOnTimestamp) {
          const diff = new Date().getTime() - deviceState.heaterOnTimestamp.getTime();
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setHeaterTimer(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setHeaterTimer(null);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [deskOn, heaterOn, deviceState.deskOnTimestamp, deviceState.heaterOnTimestamp, isConnected]);

  return (
    <Card className="device-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Device Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "p-2 rounded-lg",
              deskOn ? "bg-desk-blue bg-opacity-20" : "bg-muted"
            )}>
              <MonitorStand className={cn(
                "h-6 w-6",
                deskOn ? "text-desk-blue" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <Label htmlFor="desk-switch" className="text-base">Desk Power</Label>
              {deskTimer && (
                <p className="text-xs text-muted-foreground">ON for {deskTimer}</p>
              )}
            </div>
          </div>
          <Switch
            id="desk-switch"
            checked={deskOn}
            onCheckedChange={toggleDesk}
            disabled={!isConnected}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "p-2 rounded-lg",
              heaterOn ? "bg-desk-orange bg-opacity-20" : "bg-muted"
            )}>
              <Lamp className={cn(
                "h-6 w-6",
                heaterOn ? "text-desk-orange" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <Label htmlFor="heater-switch" className="text-base">Heater</Label>
              {heaterTimer && (
                <p className="text-xs text-muted-foreground">ON for {heaterTimer}</p>
              )}
            </div>
          </div>
          <Switch
            id="heater-switch"
            checked={heaterOn}
            onCheckedChange={toggleHeater}
            disabled={!isConnected}
          />
        </div>
      </CardContent>
    </Card>
  );
}

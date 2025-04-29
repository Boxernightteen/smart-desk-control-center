
import { useDesk, Alert } from "@/context/DeskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MoreVertical, Trash2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function AlertsCard() {
  const { alerts, clearAlert, clearAllAlerts } = useDesk();
  
  if (alerts.length === 0) {
    return (
      <Card className="device-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-muted-foreground text-center">
            <div className="space-y-2">
              <p>No alerts yet</p>
              <p className="text-xs">Alerts will appear here when they occur</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="device-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Alerts</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => clearAllAlerts()}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear all alerts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3 pr-4">
            {alerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} onClear={clearAlert} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function AlertItem({ alert, onClear }: { alert: Alert; onClear: (id: string) => void }) {
  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'temperature':
        return 'text-desk-red border-desk-red bg-desk-red/10';
      case 'humidity':
        return 'text-desk-blue border-desk-blue bg-desk-blue/10';
      case 'desk_timeout':
        return 'text-desk-orange border-desk-orange bg-desk-orange/10';
      case 'heater_timeout':
        return 'text-desk-yellow border-desk-yellow bg-desk-yellow/10';
      default:
        return 'text-desk-purple border-desk-purple bg-desk-purple/10';
    }
  };
  
  const getBadgeText = (type: Alert['type']) => {
    switch (type) {
      case 'temperature':
        return 'Temperature';
      case 'humidity':
        return 'Humidity';
      case 'desk_timeout':
        return 'Desk Timer';
      case 'heater_timeout':
        return 'Heater Timer';
      default:
        return 'Alert';
    }
  };
  
  const getBadgeVariant = (type: Alert['type']): "default" | "destructive" | "outline" => {
    switch (type) {
      case 'temperature':
      case 'humidity':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className={`p-3 rounded-lg border flex justify-between items-start alert-item ${getAlertColor(alert.type)}`}>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <Badge variant={getBadgeVariant(alert.type)}>
            {getBadgeText(alert.type)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(alert.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm">{alert.message}</p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6" 
        onClick={() => onClear(alert.id)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Clear</span>
      </Button>
    </div>
  );
}

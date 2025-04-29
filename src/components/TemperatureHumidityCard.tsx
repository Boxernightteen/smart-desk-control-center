
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDesk, SensorData } from "@/context/DeskContext";
import { Thermometer, Droplets } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TemperatureHumidityCard() {
  const { sensorData, latestSensorData, isConnected } = useDesk();
  const [view, setView] = useState<'temperature' | 'humidity'>('temperature');
  
  const formatChartData = () => {
    return sensorData.map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString(),
      temperature: d.temperature,
      humidity: d.humidity
    }));
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 35) return "text-desk-red";
    if (temp >= 30) return "text-desk-orange";
    if (temp >= 25) return "text-desk-yellow";
    return "text-desk-green";
  };
  
  const getHumidityColor = (humidity: number) => {
    if (humidity < 30) return "text-desk-red";
    if (humidity < 40) return "text-desk-orange";
    if (humidity > 70) return "text-desk-yellow";
    return "text-desk-green";
  };

  return (
    <Card className="device-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Sensor Readings</CardTitle>
        <div className="flex space-x-2">
          <Badge 
            variant={view === 'temperature' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setView('temperature')}
          >
            Temperature
          </Badge>
          <Badge 
            variant={view === 'humidity' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setView('humidity')}
          >
            Humidity
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Thermometer className={cn(
              "h-6 w-6 mr-2",
              latestSensorData ? getTemperatureColor(latestSensorData.temperature) : "text-muted-foreground"
            )} />
            <div>
              <div className="text-sm text-muted-foreground">Temperature</div>
              <div className="text-xl font-semibold">
                {latestSensorData ? 
                  `${latestSensorData.temperature.toFixed(1)}°C` : 
                  "No data"}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Droplets className={cn(
              "h-6 w-6 mr-2",
              latestSensorData ? getHumidityColor(latestSensorData.humidity) : "text-muted-foreground"
            )} />
            <div>
              <div className="text-sm text-muted-foreground">Humidity</div>
              <div className="text-xl font-semibold">
                {latestSensorData ? 
                  `${latestSensorData.humidity.toFixed(1)}%` : 
                  "No data"}
              </div>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          {isConnected && sensorData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formatChartData()}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="temperature" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D62828" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#D62828" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="humidity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CC9F0" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4CC9F0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: '#888' }}
                  tickFormatter={(value) => {
                    // Show only hours and minutes
                    const parts = value.split(':');
                    return `${parts[0]}:${parts[1]}`;
                  }}  
                />
                <YAxis 
                  tick={{ fill: '#888' }}
                  domain={view === 'temperature' ? [15, 40] : [20, 80]}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#222', 
                    borderColor: '#444',
                    color: '#fff'
                  }} 
                />
                {view === 'temperature' ? (
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#D62828" 
                    fillOpacity={1} 
                    fill="url(#temperature)" 
                    isAnimationActive={true}
                    animationDuration={500}
                    name="Temperature (°C)"
                  />
                ) : (
                  <Area 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#4CC9F0" 
                    fillOpacity={1} 
                    fill="url(#humidity)"
                    isAnimationActive={true}
                    animationDuration={500}
                    name="Humidity (%)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
              <p className="text-center mb-2">No data available</p>
              <p className="text-sm text-center">
                {!isConnected ? "Connect to your device to see sensor data" : "Waiting for data..."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

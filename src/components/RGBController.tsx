
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useDesk } from "@/context/DeskContext";
import { Paintbrush } from "lucide-react";
import { useState, useEffect } from "react";
import { debounce } from "lodash";

export function RGBController() {
  const { deviceState, setRGBColor, isConnected } = useDesk();
  const { rgbColor } = deviceState;
  
  const [localRGB, setLocalRGB] = useState({ r: rgbColor.r, g: rgbColor.g, b: rgbColor.b });
  
  // Debounced RGB color update
  const debouncedSetRGBColor = debounce((color) => {
    setRGBColor(color);
  }, 200);
  
  // Update local RGB when device state changes
  useEffect(() => {
    setLocalRGB(rgbColor);
  }, [rgbColor]);
  
  const handleColorChange = (color: keyof typeof localRGB, value: number[]) => {
    const newColor = { ...localRGB, [color]: value[0] };
    setLocalRGB(newColor);
    debouncedSetRGBColor(newColor);
  };
  
  const colorPreviewStyle = {
    backgroundColor: `rgb(${localRGB.r}, ${localRGB.g}, ${localRGB.b})`
  };

  return (
    <Card className="device-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Paintbrush className="h-5 w-5 mr-2" />
          RGB Mood Light
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          className="w-full h-24 rounded-lg mb-6 color-preview flex items-center justify-center overflow-hidden"
          style={colorPreviewStyle}
        >
          <div className="bg-black bg-opacity-30 px-3 py-1 rounded-full text-white text-sm">
            RGB({localRGB.r}, {localRGB.g}, {localRGB.b})
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-desk-red">Red</span>
              <span className="text-sm text-muted-foreground">{localRGB.r}</span>
            </div>
            <Slider
              defaultValue={[localRGB.r]}
              min={0}
              max={255}
              step={1}
              onValueChange={(value) => handleColorChange('r', value)}
              disabled={!isConnected}
              className="[&>.thumb]:bg-desk-red"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-desk-green">Green</span>
              <span className="text-sm text-muted-foreground">{localRGB.g}</span>
            </div>
            <Slider
              defaultValue={[localRGB.g]}
              min={0}
              max={255}
              step={1}
              onValueChange={(value) => handleColorChange('g', value)}
              disabled={!isConnected}
              className="[&>.thumb]:bg-desk-green"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-desk-blue">Blue</span>
              <span className="text-sm text-muted-foreground">{localRGB.b}</span>
            </div>
            <Slider
              defaultValue={[localRGB.b]}
              min={0}
              max={255}
              step={1}
              onValueChange={(value) => handleColorChange('b', value)}
              disabled={!isConnected}
              className="[&>.thumb]:bg-desk-blue"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

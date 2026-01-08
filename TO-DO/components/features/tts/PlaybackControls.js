import React from 'react';
import { View } from 'react-native';
import SliderComponent from '@/components/ui/base/Slider';
import Card from '@/components/ui/base/Card';

/**
 * Playback Controls Feature Component
 * Control pitch and speed
 */
export const PlaybackControls = ({ 
  pitch = 1.0, 
  onPitchChange,
  speed = 1.0,
  onSpeedChange,
}) => {
  return (
    <Card style={{ marginVertical: 12 }}>
      <SliderComponent
        label="Pitch"
        value={pitch}
        onValueChange={onPitchChange}
        minimumValue={0.5}
        maximumValue={2.0}
        step={0.1}
        suffix=""
      />
      <SliderComponent
        label="Speed"
        value={speed}
        onValueChange={onSpeedChange}
        minimumValue={0.5}
        maximumValue={2.0}
        step={0.1}
        suffix="x"
      />
    </Card>
  );
};

export default PlaybackControls;

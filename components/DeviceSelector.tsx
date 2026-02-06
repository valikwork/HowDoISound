"use client";

import { useDevices } from "@/hooks/useDevices";

interface DeviceSelectorProps {
  onDeviceChange: (deviceId: string) => void;
  disabled?: boolean;
}

export default function DeviceSelector({
  onDeviceChange,
  disabled,
}: DeviceSelectorProps) {
  const { devices, selectedDeviceId, setSelectedDeviceId, isLoading, error } =
    useDevices();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value;
    setSelectedDeviceId(deviceId);
    onDeviceChange(deviceId);
  };

  if (error) {
    return (
      <div className="text-sm text-red-600 dark:text-red-400">
        Error loading devices: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <label
        htmlFor="device-select"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Microphone
      </label>
      <select
        id="device-select"
        value={selectedDeviceId}
        onChange={handleChange}
        disabled={disabled || isLoading || devices.length === 0}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <option>Loading devices...</option>
        ) : devices.length === 0 ? (
          <option>No microphones found</option>
        ) : (
          devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

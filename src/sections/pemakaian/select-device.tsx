import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { DeviceData } from "src/service/data-definition";
import { initializeFirebaseClient } from "src/service/firebase-client";

const useFetchDevice = () => {
  const [data, setData] = useState<DeviceData[]>([]);

  const handleFetchData = async () => {
    const db = firebase.database();
    const ref = db.ref("/devicestore");
    const snap = await ref.get();
    const newItem: DeviceData[] = [];
    const keys: (string | null)[] = [];
    snap.forEach((_snap) => {
      const row = _snap.val();
      newItem.push(row);
      keys.push(_snap.key);
    });
    const [_lastKey] = keys.slice(-1);
    setData(newItem);
  };

  useEffect(() => {
    initializeFirebaseClient();
    handleFetchData();
  }, []);

  return {
    data,
    handleFetchData,
  };
};

type SelectDeviceProps = {
  onChange: (deviceid: string) => void;
};

const SelectDevice = ({ onChange }: SelectDeviceProps) => {
  const { data: deviceList } = useFetchDevice();
  const [deviceId, setDeviceId] = useState<string>("");

  useEffect(() => {
    if (deviceList.length > 0) {
      const _deviceId = deviceList[0].deviceid;
      if (_deviceId) {
        onChange(_deviceId);
        setDeviceId(_deviceId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(deviceList)]);

  return (
    <FormControl
      fullWidth={false}
      sx={{
        maxWidth: 300,
        minWidth: 300,
      }}
    >
      <InputLabel>Pilih Perangkat</InputLabel>
      <Select
        label="Pilih Perangkat"
        onChange={(e) => {
          const deviceid = e.target.value as string;
          onChange(deviceid);
          setDeviceId(deviceid);
        }}
        value={deviceId}
      >
        {deviceList.map(({ deviceid }) => (
          <MenuItem key={deviceid} value={deviceid} selected={deviceid === deviceId}>
            {deviceid}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectDevice;

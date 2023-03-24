import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { DeviceData } from "src/service/data-definition";
import { initializeFirebaseClient } from "src/service/firebase-client";

const useFetchDevice = () => {
  const [data, setData] = useState<DeviceData[]>([]);

  const handleFetchData = async () => {
    console.log("called");
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
    console.log(newItem);
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
  const { data } = useFetchDevice();

  return (
    <FormControl
      fullWidth={false}
      sx={{
        maxWidth: 300,
        minWidth: 300,
      }}
    >
      <InputLabel>Pilih Perangkat</InputLabel>
      <Select label="Pilih Perangkat" onChange={(e) => onChange(e.target.value as string)}>
        {data.map(({ deviceid }) => (
          <MenuItem key={deviceid} value={deviceid}>
            {deviceid}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectDevice;

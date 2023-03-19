import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeviceData,
  DeviceDataSchema,
  PatientData,
  PatientDataSchema,
} from "src/service/data-definition";
import { Stack } from "@mui/system";
import firebase from "firebase";
import { useEffect, useState } from "react";
import { initializeFirebaseClient } from "src/service/firebase-client";

const NewDeviceDataSchema = DeviceDataSchema.omit({
  patientid: true,
  weightA: true,
  weightB: true,
  updated_at: true,
});

type DeviceDataType = Partial<DeviceData> & typeof NewDeviceDataSchema._output;

export interface ModalDeletePerangkatProps {
  handleClose: () => any;
  open: boolean;
  data: DeviceDataType | null;
}

const ModalDeletePerangkat = ({ handleClose, open, data }: ModalDeletePerangkatProps) => {
  const [listPasien, setListPasien] = useState<PatientData[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<DeviceDataType>({
    defaultValues: data ?? {},
    resolver: zodResolver(NewDeviceDataSchema),
  });

  const fetchDataPasien = async () => {
    const db = firebase.database();
    const ref = db.ref("/patientstore");
    const value = await ref.once("value");
    const newListPasien: PatientData[] = [];
    value.forEach((snap) => {
      const value = snap.val();
      newListPasien.push(value);
    });
    setListPasien(newListPasien);
  };

  useEffect(() => {
    initializeFirebaseClient();
    fetchDataPasien();
  }, []);

  useEffect(() => {
    if (data) reset(data);
  }, [reset, data]);

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
      <form
        onSubmit={handleSubmit(
          async (_data, event) => {
            event?.preventDefault();
            await fetch(`/api/device/${_data.deviceid}`, {
              method: "DELETE",
              headers: {
                "content-type": "application/json",
              },
            });
            handleClose();
          },
          (...props) => {
            console.log("trace", props);
          }
        )}
      >
        <DialogTitle>Delete Perangkat</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              error={!!errors.deviceid}
              fullWidth
              helperText={errors.deviceid && errors.deviceid.message}
              label="ID Perangkat"
              disabled
              {...register("deviceid")}
            />
            <FormControl fullWidth>
              <InputLabel>Pasien</InputLabel>
              <Select
                label="Pasien"
                disabled
                {...register("patientid", {
                  valueAsNumber: true,
                })}
              >
                {listPasien.map((item) => (
                  <MenuItem value={item.patientid} key={item.patientid}>
                    {item.patientname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              error={!!errors.weightA}
              fullWidth
              helperText={errors.weightA && errors.weightA.message}
              label="Berat A"
              type="number"
              disabled
              {...register("weightA", {
                valueAsNumber: true,
              })}
            />
            <TextField
              error={!!errors.weightB}
              fullWidth
              helperText={errors.weightB && errors.weightB.message}
              label="weightB"
              type="number"
              disabled
              {...register("weightB", {
                valueAsNumber: true,
              })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            Delete
          </Button>
          <Button onClick={handleClose} variant="outlined">
            Tutup
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalDeletePerangkat;

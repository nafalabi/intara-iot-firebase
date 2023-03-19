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
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientData, PatientDataSchema } from "src/service/data-definition";
import { Stack } from "@mui/system";
import { useEffect } from "react";

const NewPatientDataSchema = PatientDataSchema.omit({
  ageinmonth: true,
  gender: true,
  patientname: true,
  patienttype: true,
  targetinfusion: true,
  weight: true,
  updated_at: true,
});

type PatientDataSchemaType = Partial<PatientData> & typeof NewPatientDataSchema._output;

export interface ModalDeletePasienProps {
  handleClose: () => any;
  open: boolean;
  data: PatientDataSchemaType | null;
}

const ModalDeletePasien = ({ handleClose, open, data }: ModalDeletePasienProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<PatientDataSchemaType>({
    defaultValues: data ?? {},
    resolver: zodResolver(NewPatientDataSchema),
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
      <form
        onSubmit={handleSubmit(
          async (_data, event) => {
            event?.preventDefault();
            await fetch(`/api/pasien/${_data.patientid}`, {
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
        <DialogTitle>Delete Pasien</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure to delete this data?
          </Typography>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              error={!!errors.patientname}
              fullWidth
              helperText={errors.patientname && errors.patientname.message}
              label="Patient Name"
              disabled
              {...register("patientname")}
            />
            <TextField
              error={!!errors.patienttype}
              fullWidth
              helperText={errors.patienttype && errors.patienttype.message}
              label="Patient Type"
              disabled
              {...register("patienttype")}
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                disabled
                {...register("gender", {
                  valueAsNumber: true,
                })}
              >
                <MenuItem value={1}>Jantan</MenuItem>
                <MenuItem value={0}>Betina</MenuItem>
              </Select>
            </FormControl>
            <TextField
              error={!!errors.ageinmonth}
              fullWidth
              helperText={errors.ageinmonth && errors.ageinmonth.message}
              label="Age in Month"
              type="number"
              disabled
              {...register("ageinmonth", {
                valueAsNumber: true,
              })}
            />
            <TextField
              error={!!errors.weight}
              fullWidth
              helperText={errors.weight && errors.weight.message}
              label="Weight"
              type="number"
              disabled
              {...register("weight", {
                valueAsNumber: true,
              })}
            />
            <TextField
              error={!!errors.targetinfusion}
              fullWidth
              helperText={errors.targetinfusion && errors.targetinfusion.message}
              label="Target Infusion"
              type="number"
              disabled
              {...register("targetinfusion", {
                valueAsNumber: true,
              })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="error">
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

export default ModalDeletePasien;

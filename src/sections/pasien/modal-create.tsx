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
import { PatientData, PatientDataSchema } from "src/service/data-definition";
import { Stack } from "@mui/system";
import { enqueueSnackbar } from "notistack";
import { RequestHelper } from "src/utils/request-helper";

export interface ModalCreatePasienProps {
  handleClose: () => any;
  open: boolean;
}

const NewPatientDataSchema = PatientDataSchema.omit({
  patientid: true,
  updated_at: true,
});

const ModalCreatePasien = ({ handleClose, open }: ModalCreatePasienProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<typeof NewPatientDataSchema._output>({
    defaultValues: {},
    resolver: zodResolver(NewPatientDataSchema),
  });

  const doCreatePatient = async (data: typeof NewPatientDataSchema._output) => {
    const response = await RequestHelper.doRequest("/api/pasien", "POST", data);
    if (!response.ok) {
      enqueueSnackbar({
        message: "Gagal menambahkan pasien",
        variant: "error",
      });
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
      <form
        onSubmit={handleSubmit(
          async (data, event) => {
            event?.preventDefault();
            await doCreatePatient(data);
            handleClose();
          },
          (...props) => {
            console.log("trace", props);
          }
        )}
      >
        <DialogTitle>Create Pasien</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              error={!!errors.patientname}
              fullWidth
              helperText={errors.patientname && errors.patientname.message}
              label="Patient Name"
              {...register("patientname")}
            />
            <TextField
              error={!!errors.patienttype}
              fullWidth
              helperText={errors.patienttype && errors.patienttype.message}
              label="Patient Type"
              {...register("patienttype")}
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
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
              {...register("targetinfusion", {
                valueAsNumber: true,
              })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
          <Button onClick={handleClose} variant="outlined">
            Tutup
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalCreatePasien;

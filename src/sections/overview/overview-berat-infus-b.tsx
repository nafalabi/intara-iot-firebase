import PropTypes from "prop-types";
import ScaleIcon from "@heroicons/react/24/solid/ScaleIcon";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

export const OverviewBeratInfusB = (props) => {
  const { value, sx } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" gutterBottom variant="overline">
              Berat Infus B
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "warning.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <ScaleIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewBeratInfusB.propTypes = {
  value: PropTypes.string.isRequired,
  sx: PropTypes.object,
};

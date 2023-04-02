import PropTypes from 'prop-types';
import EyeDropperIcon from '@heroicons/react/24/solid/EyeDropperIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const OverviewTetesan = (props) => {
  const { sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              Tetesan
            </Typography>
            <Typography variant="h5">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <EyeDropperIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTetesan.prototypes = {
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};

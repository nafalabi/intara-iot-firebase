import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import CalculatorIcon from '@heroicons/react/24/solid/CalculatorIcon';
import BookmarkSlashIcon from '@heroicons/react/24/solid/BookmarkSlashIcon';
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Overview",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Data Pasien",
    path: "/pasien",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Data Pemakaian",
    path: "/pemakaian",
    icon: (
      <SvgIcon fontSize="small">
        <CalculatorIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Data Sumbatan",
    path: "/sumbatan",
    icon: (
      <SvgIcon fontSize="small">
        <BookmarkSlashIcon />
      </SvgIcon>
    ),
  },
];

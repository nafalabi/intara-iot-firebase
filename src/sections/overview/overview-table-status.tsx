import { Typography } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import CommonTable, { CommonTableColumn } from "src/components/table";
import { DeviceData, UsageData } from "src/service/data-definition";
import { initializeFirebaseClient } from "src/service/firebase-client";

const formatDate = (date: number) => format(date, "dd/MM/yyyy hh:mm a");

type TableStatusData = {
  updated_at: number;
  deviceid: DeviceData["deviceid"];
  status: boolean;
};

const columns: CommonTableColumn<TableStatusData>[] = [
  {
    accessor: "updated_at",
    label: "Tanggal",
    render: (data) => formatDate(data.updated_at * 1000),
  },
  {
    accessor: "deviceid",
    label: "ID Infus",
  },
  {
    accessor: "status",
    label: "Status",
    render: (data) => (data.status ? "Lancar" : "Tersumbat"),
  },
];

const useData = (deviceid: DeviceData["deviceid"] | null) => {
  const [data, setData] = useState<TableStatusData[]>([]);

  const handleFetchData = async () => {
    if (!deviceid) return;
    initializeFirebaseClient();
    const db = firebase.database();
    const ref = db.ref("usagestore").orderByChild("deviceid").equalTo(deviceid);
    const snap = await ref.limitToLast(5).get();
    const newData: TableStatusData[] = [];
    snap.forEach((_snap) => {
      const value = _snap.val() as UsageData;
      const row: TableStatusData = {
        deviceid,
        status: value.dropCount > 0,
        updated_at: value.time,
      };
      newData.push(row);
    });
    setData(newData);
  };

  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
};

type OverviewTableStatusProps = {
  deviceid: DeviceData["deviceid"] | null;
};

const OverviewTableStatus = ({ deviceid }: OverviewTableStatusProps) => {
  const data = useData(deviceid);

  return (
    <>
      <Typography variant="h6" mb={1}>
        Overview Status
      </Typography>
      <CommonTable
        columns={columns}
        data={data}
        page={0}
        rowsPerPage={10}
        total={10}
        withPagination={false}
      />
    </>
  );
};

export default OverviewTableStatus;

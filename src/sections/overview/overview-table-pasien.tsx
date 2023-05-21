import { Typography } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import CommonTable, { CommonTableColumn } from "src/components/table";
import { DeviceData, PatientData } from "src/service/data-definition";
import { initializeFirebaseClient } from "src/service/firebase-client";

const formatDate = (date: number) => format(date, "dd/MM/yyyy hh:mm a");

const columns: CommonTableColumn<Partial<PatientData>>[] = [
  {
    accessor: "updated_at",
    label: "Tanggal",
    render: (data) => formatDate(data.updated_at as number),
  },
  {
    accessor: "patientname",
    label: "Nama Hewan",
  },
  {
    accessor: "patienttype",
    label: "Jenis Hewan",
  },
  {
    accessor: "gender",
    label: "Kelamin",
    render: (data) => `${data.weight} Bulan`,
  },
  {
    accessor: "weight",
    label: "Berat",
    render: (data) => `${data.weight} Kg`,
  },
  {
    accessor: "ageinmonth",
    label: "Umur",
    render: (data) => `${data.ageinmonth} Bulan`,
  },
];

type OverviewTablePasienProps = {
  deviceid: DeviceData["deviceid"] | null;
};

const useData = (deviceid: OverviewTablePasienProps["deviceid"]) => {
  const [data, setData] = useState<PatientData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchData = async () => {
    if (!deviceid) return;
    setIsLoading(true);
    initializeFirebaseClient();
    const db = firebase.database();
    const ref = db.ref("devicestore").child(deviceid);
    const deviceData = (await ref.get()).val() as DeviceData;
    const patientData = (
      await db.ref("patientstore").child(String(deviceData.patientid)).get()
    ).val() as PatientData;
    if (patientData) {
      setData([patientData]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isLoading,
  };
};

const OverviewTablePasien = ({ deviceid }: OverviewTablePasienProps) => {
  const { data, isLoading } = useData(deviceid);
  return (
    <>
      <Typography variant="h6" mb={1}>
        Overview Pasien
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

export default OverviewTablePasien;

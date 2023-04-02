import { Typography } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import CommonTable, { CommonTableColumn } from "src/components/table";
import { DeviceData, PatientData, UsageData } from "src/service/data-definition";
import { initializeFirebaseClient } from "src/service/firebase-client";

const formatDate = (date: number) => format(date, "dd/MM/yyyy hh:mm a");

type TablePemakaianData = UsageData & Partial<Pick<PatientData, "targetinfusion" | "patientname">>;

const columns: CommonTableColumn<TablePemakaianData>[] = [
  {
    accessor: "time",
    label: "Tanggal",
    render: (data) => formatDate(data.time * 1000),
  },
  {
    accessor: "deviceid",
    label: "ID Infus",
  },
  {
    accessor: "patientname",
    label: "Nama Pasien",
  },
  {
    accessor: "dropCount",
    label: "Infus / menit",
    render: (data) => `${data.dropCount} tetes/menit`,
  },
  {
    accessor: "targetinfusion",
    label: "Target infus",
  },
  {
    accessor: "weightA",
    label: "Berat Infus A",
    render: (data) => `${data.weightA} Kg`,
  },
  {
    accessor: "weightB",
    label: "Berat Infus B",
    render: (data) => `${data.weightB} Kg`,
  },
];

const useData = (deviceid: DeviceData["deviceid"] | null) => {
  const [data, setData] = useState<TablePemakaianData[]>([]);
  const refPatientCache = useRef<Record<string, PatientData>>({});

  const handleFetchPatientData = async (patientid: PatientData["patientid"]) => {
    if (refPatientCache.current[patientid]) return refPatientCache.current[patientid];
    initializeFirebaseClient();
    const db = firebase.database();
    const ref = db.ref("patientstore").child(patientid);
    const snap = await ref.once("value");
    const value: PatientData | null = snap.val();
    refPatientCache[patientid] = value;
    return value;
  };

  const handleUpdatePatientData = (usageid: UsageData["patientid"], patientData: PatientData) => {
    setData((oldData) => {
      const newData = Array.from(oldData);
      const index = newData.findIndex(({ usageid: _usageid }) => usageid === _usageid);
      if (index != -1) {
        const row = Object.assign({}, newData[index]);
        row.patientname = patientData.patientname;
        row.targetinfusion = patientData.targetinfusion;
        newData[index] = row;
      }
      return newData;
    });
  };

  const handleFetchData = async () => {
    if (!deviceid) return;
    initializeFirebaseClient();
    const db = firebase.database();
    const ref = db.ref("usagestore").orderByChild("deviceid").equalTo(deviceid);
    const snap = await ref.limitToLast(5).get();
    const newData: TablePemakaianData[] = [];
    snap.forEach((_snap) => {
      const value: UsageData = _snap.val();
      newData.push(value);
      handleFetchPatientData(value.patientid).then((patientData) => {
        if (!patientData) return;
        handleUpdatePatientData(value.usageid, patientData);
      });
    });
    setData(newData);
  };

  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
};

type OverviewTablePemakaianProps = {
  deviceid: DeviceData["deviceid"] | null;
};

const OverviewTablePemakaian = ({ deviceid }: OverviewTablePemakaianProps) => {
  const data = useData(deviceid);

  return (
    <>
      <Typography variant="h6" mb={1}>
        Overview Pemakaian
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

export default OverviewTablePemakaian;

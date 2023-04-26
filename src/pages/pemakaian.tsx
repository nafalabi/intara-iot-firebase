import { Card, Skeleton, TextField, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import CommonTable, { CommonTableColumn } from "src/components/table";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PatientData, UsageData } from "src/service/data-definition";
import { initializeFirebaseClient } from "src/service/firebase-client";
import { endOfDay, format, getUnixTime, startOfDay } from "date-fns";
import SelectDevice from "src/sections/pemakaian/select-device";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type UsageDataTableItem = UsageData & { patientname?: PatientData["patientname"] };

const columns: CommonTableColumn<UsageDataTableItem>[] = [
  {
    accessor: "usageid",
    label: "Usage ID",
  },
  {
    accessor: "deviceid",
    label: "Device ID",
  },
  {
    accessor: "patientname",
    label: "Pasien",
  },
  {
    accessor: "weightA",
    label: "Berat A",
  },
  {
    accessor: "weightB",
    label: "Berat B",
  },
  {
    accessor: "time",
    label: "Waktu",
    render: (data) => format(data.time * 1000, "dd/MM/yyyy hh:mm a"),
  },
  {
    accessor: "dropCount",
    label: "Jumlah Tetesan",
  },
];

const useUsageData = () => {
  const [deviceid, setDeviceId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
  const [data, setData] = useState<UsageDataTableItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const patientDataCache = useRef<Record<PatientData["patientid"], PatientData>>({});

  const doGetPatientData = async (patientId: string) => {
    if (patientDataCache.current[patientId]) return patientDataCache.current[patientId];
    const db = firebase.database();
    const ref = db.ref(`/patientstore/${patientId}`);
    const snapshot = await ref.once("value");
    const value = snapshot.val() as PatientData | null;
    if (value) patientDataCache.current[patientId] = value;
    return value;
  };

  const doUpdatePatientData = (usageid: string, patientData: PatientData) => {
    setData((oldData) => {
      const newData = Array.from(oldData);
      const index = newData.findIndex(({ usageid: _usageid }) => usageid === _usageid);
      if (index != -1) {
        const row = Object.assign({}, newData[index]);
        row.patientname = patientData.patientname;
        newData[index] = row;
      }
      return newData;
    });
  };

  const handleFetchData = async () => {
    setIsLoading(true);
    setData([]);
    const db = firebase.database();
    const ref = db
      .ref("/usagestore")
      .orderByKey()
      .startAt(`${deviceid}_${startDate}`)
      .endAt(`${deviceid}_${endDate}`);
    const snapshot = await ref.get();
    const newData: UsageData[] = [];
    snapshot.forEach((_snapshot) => {
      const value = _snapshot.val() as UsageData;
      newData.push(value);
      if (!value.patientid) return;
      doGetPatientData(value.patientid).then((patientData) => {
        if (!patientData) return;
        doUpdatePatientData(value.usageid as string, patientData);
      });
    });
    setData(newData);
    setIsLoading(false);
  };

  useEffect(() => {
    initializeFirebaseClient();
    if (deviceid && startDate && endDate) {
      handleFetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceid, startDate, endDate]);

  return {
    data,
    setDeviceId,
    setStartDate,
    setEndDate,
    startDate,
    endDate,
    isLoading,
  };
};

const Page = () => {
  const { data, setDeviceId, setEndDate, setStartDate, startDate, endDate, isLoading } =
    useUsageData();

  const handleChangeStartDate = (val: Date | null) => {
    if (val) setStartDate(getUnixTime(startOfDay(val)));
  };

  const handleChangeEndDate = (val: Date | null) => {
    if (val) setEndDate(getUnixTime(endOfDay(val)));
  };

  return (
    <>
      <Head>
        <title>Data Pemakaian | Intara</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Data Pemakaian</Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={4}>
              <SelectDevice onChange={(deviceid) => setDeviceId(deviceid)} />
              <DatePicker
                value={startDate ? new Date(startDate * 1000) : null}
                label="Start Date"
                onChange={handleChangeStartDate}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                value={endDate ? new Date(endDate * 1000) : null}
                label="End Date"
                onChange={handleChangeEndDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
            {isLoading ? (
              <Card sx={{ p: 2 }}>
                <Skeleton animation="wave" height={50} />
                <Skeleton animation="wave" height={35} />
                <Skeleton animation="wave" height={35} />
                <Skeleton animation="wave" height={35} />
                <Skeleton animation="wave" height={35} />
              </Card>
            ) : (
              <CommonTable
                columns={columns}
                data={data}
                page={0}
                rowsPerPage={10}
                total={10}
                withPagination={false}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

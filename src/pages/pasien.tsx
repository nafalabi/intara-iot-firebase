import { useEffect, useState } from "react";
import Head from "next/head";
import { format } from "date-fns";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import firebase from "firebase";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { initializeFirebaseClient } from "../service/firebase-client";
import CommonTable, { CommonTableColumn } from "src/components/table";
import { Gender, PatientData } from "src/service/data-definition";
import ModalCreatePasien from "src/sections/pasien/modal-create";

const columns: CommonTableColumn<PatientData>[] = [
  {
    accessor: "updated_at",
    label: "Tanggal",
    render: (data) => format(data.updated_at, "dd/MM/yyyy"),
  },
  {
    accessor: "patientname",
    label: "Nama Pasien",
  },
  {
    accessor: "patienttype",
    label: "Jenis Pasien",
  },
  {
    accessor: "gender",
    label: "Kelamin",
    render: (data) => `${data.gender === Gender.male ? "Jantan" : "Betina"}`,
  },
  {
    accessor: "weight",
    label: "Berat",
    render: (data) => `${data.weight} Bulan`,
  },
  {
    accessor: "ageinmonth",
    label: "Umur",
    render: (data) => `${data.ageinmonth} Bulan`,
  },
];

const useDataPasien = () => {
  const [data, setData] = useState<PatientData[]>([]);

  useEffect(() => {
    initializeFirebaseClient();
    const db = firebase.database();
    const dbRef = db.ref("/patientstore");
    dbRef.on('value', (snapshot) => {
      const tempData: PatientData[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          const row = child.val();
          tempData.push(row);
        });
      }
      setData(tempData);
    });
    return () => dbRef.off();
  }, []);

  return {
    data,
  };
};

const Page = () => {
  const { data } = useDataPasien();
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Data Pasien | Devias Kit</title>
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
                <Typography variant="h4">Data Pasien</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => setIsModalCreateOpen(true)}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CommonTable
              columns={columns}
              data={data}
              page={0}
              rowsPerPage={10}
              total={10}
              withPagination={false}
            />
          </Stack>
        </Container>
      </Box>

      <ModalCreatePasien
        open={isModalCreateOpen}
        handleClose={() => {
          setIsModalCreateOpen(false);
        }}
      />
    </>
  );
};

Page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

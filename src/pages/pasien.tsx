import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { format, subDays, subHours } from "date-fns";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { getDatabase, ref, child, get } from "firebase/database";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import { initializeFirebaseClient } from "../service/firebase-client";
import CommonTable, { CommonTableColumn } from "src/components/table";
import { Gender, PatientData } from "src/service/data-definition";

const columns: CommonTableColumn<PatientData>[] = [
  {
    accessor: "updated_at",
    label: "Tanggal",
    render: (data) => format(data.updated_at, "dd/MM/yyyy"),
  },
  {
    accessor: "patienname",
    label: "Nama Pasien",
  },
  {
    accessor: "patientype",
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
    const dbRef = ref(getDatabase());
    get(child(dbRef, `/patientstore`))
      .then((snapshot) => {
        const tempData: PatientData[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            const row = child.val();
            tempData.push(row);
          });
        }
        console.log(snapshot.val());
        setData(tempData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return {
    data,
  };
};

const Page = () => {
  const { data } = useDataPasien();

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
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomersSearch />
            <CommonTable columns={columns} data={data} page={0} rowsPerPage={10} total={10} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

import { useEffect, useState } from "react";
import Head from "next/head";
import { format } from "date-fns";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import firebase from "firebase";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { initializeFirebaseClient } from "../service/firebase-client";
import CommonTable, { CommonTableColumn } from "src/components/table";
import { DeviceData, PatientData } from "src/service/data-definition";
import ModalCreatePerangkat from "src/sections/perangkat/modal-create";

type DeviceDataTableItem = DeviceData & { patientname?: string };

const generateColumns = ({
  handleEdit,
  handleDelete,
}: {
  handleEdit: () => void;
  handleDelete: () => void;
}): CommonTableColumn<DeviceDataTableItem>[] => [
  {
    accessor: "updated_at",
    label: "Tanggal",
    render: (data) => format(data.updated_at, "dd/MM/yyyy"),
  },
  {
    accessor: "deviceid",
    label: "ID Perangkat",
  },
  {
    accessor: "patientname",
    label: "Nama Pasien",
  },
  {
    accessor: "weightA",
    label: "Berat A",
    render: (data) => `${data.weightA} gram`,
  },
  {
    accessor: "weightB",
    label: "Berat B",
    render: (data) => `${data.weightB} gram`,
  },
  {
    label: "Action",
    render: (data) => {
      return <div></div>;
    },
  },
];

const useDataPerangkat = () => {
  const [data, setData] = useState<DeviceDataTableItem[]>([]);

  const doGetPatientData = async (patientId: string) => {
    const db = firebase.database();
    const ref = db.ref(`/patientstore/${patientId}`);
    const snapshot = await ref.once("value");
    return snapshot.val() as PatientData | null;
  };

  const doUpdatePatientData = (patientid: string, patientData: PatientData) => {
    setData((oldData) => {
      const newData = Array.from(oldData);
      const index = newData.findIndex(({ patientid: _patientid }) => patientid === _patientid);
      if (index != -1) {
        const row = Object.assign({}, newData[index]);
        row.patientname = patientData.patientname;
        newData[index] = row;
      }
      return newData;
    });
  };

  useEffect(() => {
    initializeFirebaseClient();
    const db = firebase.database();
    const ref = db.ref("/devicestore");
    ref.on("value", (snapshot) => {
      const newData: DeviceData[] = [];
      snapshot.forEach((_snapshot) => {
        const value = _snapshot.val() as DeviceData;
        newData.push(value);
        if (!value.patientid) return;
        doGetPatientData(value.patientid).then((patientData) => {
          if (!patientData) return;
          doUpdatePatientData(value.patientid as string, patientData);
        });
      });
      setData(newData);
    });
  }, []);

  return { data };
};

const Page = () => {
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const { data } = useDataPerangkat();
  const columns = generateColumns({
    handleEdit: () => setIsModalEditOpen(true),
    handleDelete: () => setIsModalDeleteOpen(true),
  });

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
                <Typography variant="h4">Data Device</Typography>
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
      <ModalCreatePerangkat
        handleClose={() => setIsModalCreateOpen(false)}
        open={isModalCreateOpen}
      />
    </>
  );
};

Page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

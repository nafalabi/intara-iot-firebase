import Head from "next/head";
import { format } from "date-fns";
import { Box, Container, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewTetesan } from "src/sections/overview/overview-tetesan";
import { OverviewBeratInfusB } from "src/sections/overview/overview-berat-infus-b";
import { OverviewBeratInfusA } from "src/sections/overview/overview-berat-infus-a";
import { OverviewStatusAliran } from "src/sections/overview/overview-status-aliran";
import CommonTable from "src/components/table";

const formatDate = (date) => format(date, "dd/MM/yyyy");

const Page = () => (
  <>
    <Head>
      <title>Dashboard | Intara</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewTetesan
              difference={12}
              positive
              sx={{ height: "100%" }}
              value="50 tetes/menit"
            />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewBeratInfusA
              difference={16}
              positive={false}
              sx={{ height: "100%" }}
              value="300g"
            />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewBeratInfusB sx={{ height: "100%" }} value="350g" />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewStatusAliran sx={{ height: "100%" }} value="Lancar" />
          </Grid>
          <Grid xs={12} lg={7}>
            <Typography variant="h6" mb={1}>Overview Pasien</Typography>
            <CommonTable
              columns={[
                {
                  accessor: "updated_at",
                  label: "Tanggal",
                  render: (data) => formatDate(data.updated_at),
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
                },
                {
                  accessor: "weight",
                  label: "Berat",
                },
                {
                  accessor: "ageinmonth",
                  label: "Umur",
                },
              ]}
              data={[
                {
                  patientname: "cimeong",
                  ageinmonth: "20 bulan",
                  gender: "Jantan",
                  patienttype: "Kucing",
                  updated_at: Date.now(),
                  weight: "20 kg",
                },
                {
                  patientname: "cikapas",
                  ageinmonth: "20 bulan",
                  gender: "Betina",
                  patienttype: "Kucing",
                  updated_at: Date.now(),
                  weight: "20 kg",
                },
                {
                  patientname: "ciguguk",
                  ageinmonth: "22 bulan",
                  gender: "Jantan",
                  patienttype: "Anjing",
                  updated_at: Date.now(),
                  weight: "30 kg",
                },
              ]}
            />
          </Grid>
          <Grid xs={12} lg={5}>
            <Typography variant="h6" mb={1}>Overview Status</Typography>
            <CommonTable
              columns={[
                {
                  accessor: "updated_at",
                  label: "Tanggal",
                  render: (data) => formatDate(data.updated_at),
                },
                {
                  accessor: "deviceid",
                  label: "ID Infus",
                },
                {
                  accessor: "status",
                  label: "Status",
                },
              ]}
              data={[
                {
                  updated_at: Date.now(),
                  deviceid: "device-1",
                  status: "Lancar",
                },
                {
                  updated_at: Date.now(),
                  deviceid: "device-2",
                  status: "Lancar",
                },
                {
                  updated_at: Date.now(),
                  deviceid: "device-3",
                  status: "Lancar",
                },
              ]}
            />
          </Grid>
          <Grid xs={12} lg={12}>
            <Typography variant="h6" mb={1}>Overview Pemakaian</Typography>
            <CommonTable
              columns={[
                {
                  accessor: "updated_at",
                  label: "Tanggal",
                  render: (data) => formatDate(data.updated_at),
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
                  accessor: "rateDrop",
                  label: "Infus / menit",
                },
                {
                  accessor: "infusionTarget",
                  label: "Target infus",
                },
                {
                  accessor: "currentWeightA",
                  label: "Berat Infus A",
                },
                {
                  accessor: "currentWeightB",
                  label: "Berat Infus B",
                },
              ]}
              data={[
                {
                  updated_at: Date.now(),
                  deviceid: "device-1",
                  currentWeightA: 250,
                  currentWeightB: 350,
                  infusionTarget: 150,
                  patientname: "cimeong",
                  rateDrop: "50 tetes/menit",
                },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

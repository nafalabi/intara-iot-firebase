import Head from "next/head";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewTetesan } from "src/sections/overview/overview-tetesan";
import { OverviewBeratInfusB } from "src/sections/overview/overview-berat-infus-b";
import { OverviewBeratInfusA } from "src/sections/overview/overview-berat-infus-a";
import { OverviewStatusAliran } from "src/sections/overview/overview-status-aliran";
import { Stack } from "@mui/system";
import SelectDevice from "src/sections/pemakaian/select-device";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { DeviceData, UsageData } from "src/service/data-definition";
import { initializeFirebaseClient } from "src/service/firebase-client";
import OverviewTablePasien from "src/sections/overview/overview-table-pasien";
import OverviewTableStatus from "src/sections/overview/overview-table-status";
import OverviewTablePemakaian from "src/sections/overview/overview-table-pemakaian";

const useOverviewData = (deviceId: DeviceData["deviceid"] | null) => {
  const [isDataExist, setIsDataExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [overviewData, setOverviewData] = useState({
    dropCount: 0,
    weightA: 0,
    weightB: 0,
    infusionStatus: false,
  });

  useEffect(() => {
    const handleChangeDevice = async () => {
      initializeFirebaseClient();
      setIsLoading(true);
      const db = firebase.database();
      const ref = db.ref("usagestore").orderByChild("deviceid").equalTo(deviceId);
      const snap = await ref.limitToLast(1).get();
      if (!snap.hasChildren()) {
        setIsLoading(false);
        setIsDataExist(false);
        return;
      }
      snap.forEach((_snap) => {
        const value: UsageData = _snap.val();
        setOverviewData({
          dropCount: value.dropCount,
          weightA: value.weightA,
          weightB: value.weightB,
          infusionStatus: value.dropCount > 0,
        });
        setIsLoading(false);
        setIsDataExist(true);
      });
    };
    handleChangeDevice();
  }, [deviceId]);

  return {
    isDataExist,
    isLoading,
    overviewData,
  };
};

const Page = () => {
  const [deviceId, setDeviceId] = useState<DeviceData["deviceid"] | null>(null);
  const { isDataExist, isLoading, overviewData } = useOverviewData(deviceId);

  return (
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
          <Stack direction="row" spacing={4} mb={3}>
            <SelectDevice onChange={(deviceid) => setDeviceId(deviceid)} />
          </Stack>
          {isLoading ? (
            <FeedbackPanel>Loading...</FeedbackPanel>
          ) : (
            <>
              {isDataExist && <OverviewContent {...overviewData} deviceid={deviceId} />}
              {!isDataExist && <FeedbackPanel>No Data</FeedbackPanel>}
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

const FeedbackPanel = ({ children }: React.ComponentProps<"div">) => {
  return (
    <Box
      sx={(theme) => ({
        textAlign: "center",
        my: 5,
        py: 8,
        borderRadius: "0.5rem",
        boxShadow: theme.shadows[4],
      })}
    >
      {children}
    </Box>
  );
};

type OverviewContentProps = {
  deviceid: DeviceData["deviceid"] | null;
  dropCount: number;
  weightA: number;
  weightB: number;
  infusionStatus: boolean;
};

const OverviewContent = ({
  deviceid,
  dropCount,
  weightA,
  weightB,
  infusionStatus,
}: OverviewContentProps) => {
  return (
    <Grid container spacing={3}>
      <Grid xs={12} sm={6} lg={3}>
        <OverviewTetesan sx={{ height: "100%" }} value={`${dropCount} drop/min`} />
      </Grid>
      <Grid xs={12} sm={6} lg={3}>
        <OverviewBeratInfusA sx={{ height: "100%" }} value={`${weightA}g`} />
      </Grid>
      <Grid xs={12} sm={6} lg={3}>
        <OverviewBeratInfusB sx={{ height: "100%" }} value={`${weightB}g`} />
      </Grid>
      <Grid xs={12} sm={6} lg={3}>
        <OverviewStatusAliran
          sx={{ height: "100%" }}
          value={infusionStatus ? "Lancar" : "Tersumbat"}
        />
      </Grid>
      <Grid xs={12} lg={7}>
        <OverviewTablePasien deviceid={deviceid} />
      </Grid>
      <Grid xs={12} lg={5}>
        <OverviewTableStatus deviceid={deviceid} />
      </Grid>
      <Grid xs={12} lg={12}>
        <OverviewTablePemakaian deviceid={deviceid} />
      </Grid>
    </Grid>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => {
  return <div />
};

Page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

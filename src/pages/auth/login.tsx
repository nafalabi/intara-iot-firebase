import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useAuthContext } from "src/contexts/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const auth = useAuthContext();
  const [errorLoginMsg, setErrorLoginMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/");
    }
  }, [auth, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      submit: "",
    },
    resolver: zodResolver(
      z.object({
        email: z.string().email("Must be a valid email"),
        password: z.string().min(1, "Password is required"),
      })
    ),
  });

  return (
    <>
      <Head>
        <title>Login | Intara</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={handleSubmit(
                (data, event) => {
                  event?.preventDefault();
                  setErrorLoginMsg("");
                  setIsLoading(true);
                  auth.signIn(data.email, data.password).catch((error: Error) => {
                    setErrorLoginMsg(error.message);
                  }).finally(() => {
                    setIsLoading(false);
                  });
                },
                () => {}
              )}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!errors.email}
                  fullWidth
                  helperText={errors.email && errors.email.message}
                  label="Email Address"
                  type="email"
                  {...register("email")}
                />
                <TextField
                  error={!!errors.password}
                  fullWidth
                  helperText={errors.password && errors.password.message}
                  label="Password"
                  type="password"
                  {...register("password")}
                />
              </Stack>
              {errorLoginMsg && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {errorLoginMsg}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained" disabled={isLoading}>
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;

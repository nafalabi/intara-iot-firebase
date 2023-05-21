import { useTheme } from '@mui/material/styles';

export const Logo = () => {
  const theme = useTheme();
  const fillColor = theme.palette.primary.main;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 2000 2000"
    >
      <defs>
        <style>{".cls-3{fill:#252525}"}</style>
      </defs>
      <text
        style={{
          fill: "#252525",
          fontSize: "139.33px",
          fontFamily: "Gotham-Book,Gotham",
          letterSpacing: ".1em",
        }}
        transform="matrix(.99 0 0 1 717.04 1545.86)"
      >
        {"IN"}
        <tspan
          x={178.48}
          y={0}
          style={{
            letterSpacing: ".01em",
          }}
        >
          {"T"}
        </tspan>
        <tspan x={270.16} y={0}>
          {"ARA"}
        </tspan>
      </text>
      <path
        d="M867.79 805c14.15 24.86 28.4 49.67 42.44 74.59 75.82 134.66 152.21 269 227.06 404.21 26.25 47.42 61.33 75.78 117 72.86 8-.42 16.26 3.07 24.39 4.75-.39 2.53-.79 5.06-1.18 7.59H776.44c-.66-1.64-1.33-3.27-2-4.91 5.83-2.57 11.44-6.58 17.51-7.51 57.63-8.81 70.49-23.24 70.56-82.38q.27-221.72.06-443.43v-24.24ZM769.23 453.92c22.25-15 490.72-15.57 513.73-1.93-13.43 3.08-22.66 5.89-32.09 7.23-40 5.71-53.23 19-57.67 60.22a324.06 324.06 0 0 0-1.54 34.56q-.15 212.85-.06 425.69v27l-4.33 2.23c-3.8-6.1-7.85-12.06-11.38-18.32C1090 838.21 1003.54 686.17 918.8 533.13c-26.53-47.91-60.48-78.8-117.65-75.35-8.44.51-17.06-1.96-31.92-3.86Z"
        className="cls-3"
      />
    </svg>
  );
};

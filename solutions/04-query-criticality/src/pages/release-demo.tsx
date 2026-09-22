import Home from "./index";
export { getServerSideProps } from "./index";

export default function ReleaseDemo(props: { initialAnalyticsUnavailable?: boolean }) {
  return <Home {...props} demoMode />;
}

import {
  Container,
  Grid,
  SimpleGrid,
  Skeleton,
  Text,
  rem,
  Title,
  Button,
  Box,
  Paper,
  Group,
  Divider,
  useMantineTheme,
  Alert,
} from "@mantine/core";
import { StatsCollection, StatsRing, StatsTrend } from "@/components";
import { IconCreditCard, IconRefresh, IconChartBar, IconInfoCircle, IconAlertTriangle } from "@tabler/icons-react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { TransactionDashboardData, AnalyticsData } from "@/types";
import { apiFetcher } from "@/utils/fetcher";
import { createPrefetch } from "@/utils/prefetcher";
import { useRouter } from 'next/router';
const PRIMARY_COL_HEIGHT = rem(300);
const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

function formatDollarPrice(amount: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

const QUANTITY = 1;

export default function Home() {
  const theme = useMantineTheme();
  const router = useRouter();

  const { data, isFetching, error, refetch } = useQuery<{
    message: string;
    data: TransactionDashboardData;
  }>({
    staleTime: 60_000,
    queryKey: ["transactions", QUANTITY],
    retryDelay: (attemptIndex) => 1000 * attemptIndex,
    retry: 10,
    queryFn: async () => {
      return await apiFetcher({
        url: `/api/proxy/transactions?quantity=${QUANTITY}`,
        errorTag: "GetTransactionsClientError",
      });
    }
  });

  // Add analytics data query (non-critical)
  const {
    data: analyticsData,
    isFetching: isAnalyticsFetching,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useQuery<{
    message: string;
    data: AnalyticsData;
  }>({
    staleTime: 60_000,
    queryKey: ["analytics"],
    retryDelay: (attemptIndex) => 1000 * attemptIndex,
    retry: 5,
    queryFn: async () => {
      return await apiFetcher({
        url: `/api/proxy/analytics`,
        errorTag: "GetAnalyticsClientError",
      });
    },
  });

  const results = data?.data;
  const analytics = analyticsData?.data;

  if (error) {
    return (
      <Container
        style={{
          backgroundColor: theme.colors.gray[0],
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.xl,
        }}
      >
        <Paper
          p="xl"
          radius="md"
          shadow="md"
          withBorder
          style={{ maxWidth: 600, width: '100%' }}
        >
          <Group align="center" mb="xl">
            <IconAlertTriangle size={50} color={theme.colors.red[6]} stroke={1.5} />
            <Title order={1} fw={700} c="dimmed">Critical Error</Title>
          </Group>

          <Text size="lg" mb="xl">
            We&apos;re sorry, but a critical error occurred while loading the financial data.
            {error.message && (
              <Text color="red" mt="md" fw={500}>
                Error: {error.message}
              </Text>
            )}
          </Text>

          <SimpleGrid cols={2} spacing="md" mt="xl">
            <Button
              onClick={() => refetch()}
              color="blue"
              radius="md"
              leftSection={<IconRefresh size={16} />}
              fullWidth
            >
              Try Again
            </Button>
            <Button
              onClick={() => router.reload()}
              color="gray"
              radius="md"
              variant="outline"
              fullWidth
            >
              Reload Page
            </Button>
          </SimpleGrid>
        </Paper>
      </Container>
    );
  }

  const topCardType =
    Object.keys(results?.amountsByCardType ?? {}).length > 0
      ? Object.entries(results?.amountsByCardType ?? {}).sort((a, b) => b[1] - a[1])[0][0]
      : "";

  return (
    <Box
      style={{
        backgroundColor: theme.colors.gray[0],
        minHeight: "100vh",
        padding: theme.spacing.md,
      }}
    >
      <Container
        fluid
        px="md"
        py="xl"
      >
        <Paper p="md" radius="md" shadow="sm" mb="xl" withBorder>
          <Group justify="space-between" mb="xs">
            <Group>
              <IconChartBar size={28} stroke={1.5} color={theme.colors.blue[6]} />
              <Title order={2} fw={700} c="dimmed">Financial Dashboard</Title>
            </Group>

            <Group>
              <Button
                onClick={() => refetchAnalytics()}
                color="green"
                radius="md"
                leftSection={<IconRefresh size={16} />}
                variant="light"
              >
                Refresh Analytics
              </Button>
              <Button
                onClick={() => refetch()}
                color="blue"
                radius="md"
                leftSection={<IconRefresh size={16} />}
                variant="light"
              >
                Refresh Transactions
              </Button>
            </Group>
          </Group>
          <Divider mb="lg" />

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {isFetching ? (
              <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate />
            ) : (
              <Paper radius="md" p="md" shadow="sm" withBorder>
                <Text c="dimmed" fw={500} mb="md">Card Type Analysis</Text>
                <StatsCollection
                  data={Object.entries(results?.amountsByCardType ?? {})
                    .slice(0, 3)
                    .map(([cardType, amount]) => ({
                      label: cardType,
                      value: formatDollarPrice(String(amount)),
                      icon: IconCreditCard,
                    }))}
                />
              </Paper>
            )}
            <Grid gutter="md">
              <Grid.Col>
                {isFetching ? (
                  <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate />
                ) : (
                  <Paper radius="md" p="md" shadow="sm" withBorder>
                    <Text c="dimmed" fw={500} mb="md">Transaction Metrics</Text>
                    <StatsRing
                      data={[
                        {
                          label: "Top Card Type",
                          stats: topCardType,
                          progress: 65,
                          color: "teal",
                          icon: "up",
                        },
                        {
                          label: "Domestic Transactions",
                          stats: String(results?.domesticCount),
                          progress: 72,
                          color: "blue",
                          icon: "up",
                        },
                        {
                          label: "Int. Transactions",
                          stats: String(results?.internationalCount),
                          progress: 52,
                          color: "red",
                          icon: "down",
                        },
                      ]}
                    />
                  </Paper>
                )}
              </Grid.Col>
              <Grid.Col>
                <SimpleGrid cols={2} spacing="md">
                  <Grid.Col>
                    {isFetching ? (
                      <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate />
                    ) : (
                      <Paper h="100%" radius="md" p="md" shadow="sm" withBorder>
                        <StatsTrend
                          title="Total Revenue"
                          value={formatDollarPrice(String(results?.totalAmount))}
                          diff={5}
                        />
                      </Paper>
                    )}
                  </Grid.Col>
                  <Grid.Col>
                    {isFetching ? (
                      <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate />
                    ) : (
                      <Paper h="100%" radius="md" p="md" shadow="sm" withBorder>
                        <StatsTrend title="Monthly Growth" value="$13,456" diff={-10} />
                      </Paper>
                    )}
                  </Grid.Col>
                </SimpleGrid>
              </Grid.Col>
            </Grid>
          </SimpleGrid>

          {/* Analytics Section - Optional Data */}
          <Paper p="md" radius="md" shadow="sm" mt="xl" withBorder>
            <Group mb="md">
              <IconInfoCircle size={24} color={theme.colors.blue[6]} />
              <Text fw={600} size="lg">Analytics Dashboard</Text>
            </Group>

            {analyticsError ? (
              <Alert color="yellow" title="Analytics Unavailable" variant="light">
                Unable to load analytics data. This is non-critical information.
              </Alert>
            ) : isAnalyticsFetching ? (
              <Skeleton height={rem(200)} radius="md" animate />
            ) : analytics ? (
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <Paper radius="md" p="md" shadow="xs" withBorder>
                  <Text fw={500} mb="xs">Daily Visitors</Text>
                  <Text size="xl" fw={700}>{analytics.dailyVisitors.toLocaleString()}</Text>
                </Paper>

                <Paper radius="md" p="md" shadow="xs" withBorder>
                  <Text fw={500} mb="xs">Conversion Rate</Text>
                  <Text size="xl" fw={700}>{analytics.conversionRate}%</Text>
                </Paper>

                <Paper radius="md" p="md" shadow="xs" withBorder>
                  <Text fw={500} mb="xs">Avg. Session Time</Text>
                  <Text size="xl" fw={700}>{analytics.averageSessionTime}</Text>
                </Paper>

                <Paper radius="md" p="md" shadow="xs" withBorder>
                  <Text fw={500} mb="xs">Bounce Rate</Text>
                  <Text size="xl" fw={700}>{analytics.bounceRate}%</Text>
                </Paper>

                <Paper radius="md" p="md" shadow="xs" withBorder>
                  <Text fw={500} mb="xs">Device Breakdown</Text>
                  <Text size="sm">Desktop: {analytics.deviceBreakdown.desktop}%</Text>
                  <Text size="sm">Mobile: {analytics.deviceBreakdown.mobile}%</Text>
                  <Text size="sm">Tablet: {analytics.deviceBreakdown.tablet}%</Text>
                </Paper>

                <Paper radius="md" p="md" shadow="xs" withBorder>
                  <Text fw={500} mb="xs">Top Referrers</Text>
                  {analytics.topReferrers.map((referrer: string, i: number) => (
                    <Text key={i} size="sm">{i + 1}. {referrer}</Text>
                  ))}
                </Paper>
              </SimpleGrid>
            ) : null}
          </Paper>
        </Paper>
      </Container>
    </Box>
  );
}

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();
  const prefetch = createPrefetch(queryClient, 2_000);

  // Critical prefetch - will throw error if fails
  await prefetch.criticalQuery(["transactions", QUANTITY], () =>
    apiFetcher({
      url: `http://localhost:3000/api/proxy/transactions?quantity=${QUANTITY}`,
      errorTag: "GetTransactionsServerError",
    })
  );

  // Optional prefetch - won't throw error if fails
  await prefetch.optionalQuery(["analytics"], () =>
    apiFetcher({
      url: `http://localhost:3000/api/proxy/analytics`,
      errorTag: "GetAnalyticsServerError",
    })
  );

  const dehydratedState = prefetch.dehydrate();

  return {
    props: {
      dehydratedState,
    },
  };
};
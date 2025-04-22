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
} from "@mantine/core";
import { StatsCollection, StatsRing, StatsTrend } from "@/components";
import { IconCreditCard, IconRefresh, IconChartBar } from "@tabler/icons-react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { TransactionDashboardData } from "@/types";
import { apiFetcher } from "@/utils/fetcher";
import { createPrefetch } from "@/utils/prefetcher";

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
      });
    },
  });

  const results = data?.data;

  if (error) {
    return (
      <Container my="xl">
        <Paper p="xl" radius="md" shadow="md" withBorder>
          <Text ta="center" c="red" size="lg" fw={500}>
            {error.message}
          </Text>
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
            
            <Button 
              onClick={() => refetch()} 
              color="blue" 
              radius="md"
              leftSection={<IconRefresh size={16} />}
              variant="light"
            >
              Refresh Data
            </Button>
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
        </Paper>
      </Container>
    </Box>
  );
}

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();
  const prefetchHandler = createPrefetch(queryClient, 500);

  await prefetchHandler.prefetch(["transactions", QUANTITY], () =>
    apiFetcher({
      url: `http://localhost:3000/api/proxy/transactions?quantity=${QUANTITY}`,
    })
  );

  const dehydratedState = prefetchHandler.dehydrate();

  return {
    props: {
      dehydratedState,
    },
  };
};
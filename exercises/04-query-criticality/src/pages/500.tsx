import { 
  Box,
  Title, 
  Text, 
  Button, 
  Group, 
  Paper, 
  SimpleGrid,
  useMantineTheme 
} from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { useRouter } from 'next/router';

export default function Custom500() {
  const router = useRouter();
  const theme = useMantineTheme();

  const handleRefresh = () => {
    router.reload();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Box 
      style={{
        backgroundColor: theme.colors.gray[0],
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: 0,
      }}
    >
      <Paper 
        p="xl" 
        radius="md" 
        shadow="md" 
        withBorder
        style={{ 
          width: '100%',
          maxWidth: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 0,
        }}
      >
        <Box style={{ maxWidth: 600, width: '100%', padding: theme.spacing.xl }}>
          <Group align="center" mb="xl">
            <IconAlertTriangle size={60} color={theme.colors.red[6]} stroke={1.5} />
            <Title order={1} fw={700} c="dimmed">Server Error</Title>
          </Group>
          
          <Text size="lg" mb="xl">
            We&apos;re sorry, but a critical error occurred while loading the financial data. 
            Our team has been notified and is working to resolve the issue.
          </Text>
          
          <SimpleGrid cols={2} spacing="md" mt="xl">
            <Button 
              onClick={handleRefresh} 
              color="blue" 
              radius="md"
              leftSection={<IconRefresh size={16} />}
              fullWidth
              size="lg"
            >
              Try Again
            </Button>
            <Button 
              onClick={handleGoHome} 
              color="gray" 
              radius="md"
              variant="outline"
              fullWidth
              size="lg"
            >
              Return Home
            </Button>
          </SimpleGrid>
        </Box>
      </Paper>
    </Box>
  );
} 
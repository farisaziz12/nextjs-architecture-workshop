import { Group, Paper, Text, ThemeIcon, SimpleGrid } from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";
import classes from "./StatsTrend.module.css";

type Props = {
  title: string;
  value: string;
  diff: number;
};

export function StatsTrend({ title, value, diff }: Props) {
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight;

  return (
    <div className={classes.root}>
      <Paper withBorder p="md" radius="md" key={title}>
        <Group justify="apart">
          <div>
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>
              {title}
            </Text>
            <Text fw={700} fz="xl">
              {value}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            style={{
              color:
                diff > 0 ? "var(--mantine-color-teal-6)" : "var(--mantine-color-red-6)",
            }}
            size={38}
            radius="md"
          >
            <DiffIcon size="1.8rem" stroke={1.5} />
          </ThemeIcon>
        </Group>
        <Text c="dimmed" fz="sm" mt="md">
          <Text component="span" c={diff > 0 ? "teal" : "red"} fw={700}>
            {diff}%
          </Text>{" "}
          {diff > 0 ? "increase" : "decrease"} compared to last month
        </Text>
      </Paper>
    </div>
  );
}
